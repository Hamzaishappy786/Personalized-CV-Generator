import json
import os
import time
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Cascade from primary down through stable low-end and lite alternatives
MODELS = [
    "gemini-2.5-flash", 
    "gemini-3.1-flash-lite", 
    "gemini-2.5-flash-lite"
] 

SCHEMA_DESC = """
{
  "name": string,
  "headline": string|null,
  "summary": string|null,
  "contact": {
    "email": string|null,
    "phone": string|null,
    "location": string|null,
    "linkedin": string|null,
    "portfolio": string|null
  }|null,
  "education": [{"degree": string, "institution": string|null, "year": string|null}],
  "experience": [{"title": string, "company": string, "duration": string|null, "location": string|null, "bullets": [string], "skills_used": [string]}],
  "projects": [{"name": string, "description": string|null, "tech": [string], "link": string|null}],
  "skills": [string],
  "certifications": [string],
  "awards": [string],
  "languages": [string]
}
Omit keys that have no data rather than using empty arrays.
"""

EXAMPLES = [
    {
        "field": "software",
        "bio": "im ali, cs grad from fast 2021, backend dev at cloudbyte for 2 years using python fastapi postgres, built auth service and dockerized deployments, know aws and redis too",
    },
    {
        "field": "marketing",
        "bio": "fatima here, bba marketing from lums 2020, spent 3 years at unilever and a small agency doing brand campaigns, seo, canva, hubspot, also made a product launch deck and managed linkedin content",
    },
    {
        "field": "design",
        "bio": "im sara, ux designer from nust, did freelance and one startup role, used figma, adobe xd, user research, and built a mobile app prototype for a fitness startup",
    },
    {
        "field": "data",
        "bio": "im bilal, economics degree 2019 then data analyst at a fintech for 4 years, sql powerbi python and dashboards, made churn model and automated monthly reporting",
    },
    {
        "field": "student",
        "bio": "hey im noor final year ai student at fast, ta for ml lab, did a rag chatbot fyp with langchain and pgvector, good with python, pytorch, and prompt engineering",
    },
]

PROMPT = f"""Generate one synthetic training example for fine-tuning a resume-parsing model.

Output strict JSON with two keys: "input" and "output".

"input": a realistic, messy, informal first-person bio (1-3 sentences, like someone typing
quickly without punctuation discipline, typos ok, casual tone) describing their education,
work experience, skills, projects. Vary: field (CS, business, design, engineering, marketing,
medicine, etc), seniority (student to 10+ years), and writing style (terse vs rambling).
Use the examples below only as style guidance, not as exact copies:
{json.dumps(EXAMPLES, ensure_ascii=False)}

"output": the same info structured according to this exact CV schema:
{SCHEMA_DESC}

Rules:
- never add top-level keys outside the schema
- never output a key like "degree" or "work_experience" at the top level
- keep arrays empty only when no data exists
- use null for optional scalar fields when unknown
- if a field is absent, omit it entirely rather than inventing it

Return ONLY the JSON object, no markdown fences, no preamble.
"""


def is_valid_example(example):
    if not isinstance(example, dict):
        return False
    if "input" not in example or "output" not in example:
        return False
    output = example["output"]
    if not isinstance(output, dict):
        return False
    required = ("name",)
    if not all(key in output for key in required):
        return False
    meaningful_keys = ("education", "experience", "skills", "projects", "certifications", "languages")
    return any(output.get(key) for key in meaningful_keys)


def is_strong_output(example):
    output = example.get("output", {})
    if not isinstance(output, dict):
        return False
    has_education_or_experience = bool(output.get("education")) or bool(output.get("experience"))
    has_skills = bool(output.get("skills"))
    return has_education_or_experience and has_skills and bool(output.get("name"))

def generate_one(model_name):
    resp = client.models.generate_content(
        model=model_name,
        contents=PROMPT,
    )
    text = resp.text.strip()
    text = text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(text)

def generate_one_with_retry(max_retries=5):
    model_idx = 0  # Start with the preferred model
    
    for attempt in range(max_retries):
        try:
            current_model = MODELS[model_idx]
            example = generate_one(current_model)
            if is_valid_example(example) and is_strong_output(example):
                return example
            raise ValueError("invalid or weak synthetic example shape")
        except Exception as e:
            err_str = str(e)
            
            # Check for 503 / Service Unavailable errors
            if "503" in err_str or "UNAVAILABLE" in err_str:
                if model_idx < len(MODELS) - 1:
                    model_idx += 1
                    print(f"  503 Service Unavailable. Falling back to lower-end model: {MODELS[model_idx]}")
                    time.sleep(5)  # Quick breather before immediate fallback retry
                    continue  # Retry using the new model index without incrementing wait times yet
            
            # Catch rate-limits or handle 503 if we are already out of fallback models
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "503" in err_str or "UNAVAILABLE" in err_str:
                wait = 20 * (attempt + 1)  # 20s, 40s, 60s...
                print(f"  issue encountered ({err_str[:40]}...), waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    raise RuntimeError("Max retries exceeded")

def main(n=200, out_path="data.jsonl"):
    with open(out_path, "a", encoding="utf-8") as f:
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