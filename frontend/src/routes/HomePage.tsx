import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client";

type Template = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

export default function HomePage() {
  const [status, setStatus] = useState("loading");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const health = await apiGet("/api/health");
        const templateData = await apiGet("/api/templates");
        setStatus(String((health as { status?: string }).status ?? "unknown"));
        setTemplates((templateData as { templates?: Template[] }).templates ?? []);
      } catch {
        setStatus("offline");
      }
    }

    void loadData();
  }, []);

  async function handlePreview() {
    const response = await apiPost("/api/cv/preview", {
      text: input,
      template_id: templates[0]?.id ?? "ats-clean",
    });
    setResult(JSON.stringify(response, null, 2));
  }

  return (
    <main className="page">
      <h1>Personalized CV Generator</h1>
      <p>Backend status: {status}</p>

      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Paste a rough bio here"
        rows={6}
        style={{ width: "100%", marginTop: 12 }}
      />

      <button type="button" onClick={handlePreview} style={{ marginTop: 12 }}>
        Generate Preview
      </button>

      <section style={{ marginTop: 24 }}>
        <h2>Templates</h2>
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <strong>{template.name}</strong> - {template.description}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Preview JSON</h2>
        <pre>{result}</pre>
      </section>
    </main>
  );
}
