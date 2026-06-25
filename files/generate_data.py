"""
Generates synthetic (messy_bio -> structured_cv_json) training pairs using Gemini.
Run locally with your own GEMINI_API_KEY (get one free at aistudio.google.com).
Appends to data.jsonl.

pip install google-genai
"""

import json
import os
import time
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-2.5-flash"  # fast + cheap, plenty for this task

SCHEMA_DESC = """
{
  "name": string,
  "education": [{"degree": string, "institution": string|null, "year": string|null}],
  "experience": [{"title": string, "company": string, "duration": string|null, "skills_used": [string]}],
  "projects": [{"name": string, "tech": [string]}],
  "skills": [string],
  "certifications": [string]
}
Omit keys that have no data rather than using empty arrays.
"""

PROMPT = f"""Generate one synthetic training example for fine-tuning a resume-parsing model.

Output strict JSON with two keys: "input" and "output".

"input": a realistic, messy, informal first-person bio (1-3 sentences, like someone typing
quickly without punctuation discipline, typos ok, casual tone) describing their education,
work experience, skills, projects. Vary: field (CS, business, design, engineering, marketing,
medicine, etc), seniority (student to 10+ years), and writing style (terse vs rambling).

"output": the same info structured according to this schema:
{SCHEMA_DESC}

Return ONLY the JSON object, no markdown fences, no preamble.
"""

def generate_one():
    resp = client.models.generate_content(
        model=MODEL,
        contents=PROMPT,
    )
    text = resp.text.strip()
    text = text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(text)

def generate_one_with_retry(max_retries=5):
    for attempt in range(max_retries):
        try:
            return generate_one()
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                wait = 20 * (attempt + 1)  # 20s, 40s, 60s...
                print(f"  rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise RuntimeError("Max retries exceeded")

def main(n=200, out_path="data.jsonl"):
    with open(out_path, "a") as f:
        for i in range(n):
            try:
                example = generate_one_with_retry()
                f.write(json.dumps(example) + "\n")
                f.flush()
                print(f"[{i+1}/{n}] ok")
            except Exception as e:
                print(f"[{i+1}/{n}] failed: {e}")
            time.sleep(13)  # ~4.6 req/min, stays under the 5 RPM free-tier cap

if __name__ == "__main__":
    main(n=200)