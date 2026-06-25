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
  const [templateId, setTemplateId] = useState("ats-clean");
  const [format, setFormat] = useState("pdf");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const health = await apiGet("/api/health");
        const templateData = await apiGet("/api/templates");
        setStatus(String((health as { status?: string }).status ?? "unknown"));
        const loadedTemplates = (templateData as { templates?: Template[] }).templates ?? [];
        setTemplates(loadedTemplates);
        setTemplateId(loadedTemplates[0]?.id ?? "ats-clean");
      } catch {
        setStatus("offline");
      }
    }

    void loadData();
  }, []);

  async function handlePreview() {
    setBusy(true);
    setError("");
    try {
      const response = await apiPost("/api/cv/preview", {
        text: input,
        template_id: templateId,
      });
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleExport() {
    setBusy(true);
    setError("");
    try {
      const response = await apiPost("/api/cv/export", {
        text: input,
        template_id: templateId,
        format,
      });
      setResult(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <div className="hero">
        <h1>Personalized CV Generator</h1>
        <p>Lightweight CV builder with local preview and export.</p>
        <span className={`status status-${status}`}>Backend: {status}</span>
      </div>

      <section className="panel">
        <label className="field">
          <span>Paste your bio or rough profile</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Example: software engineer, 3 years at Systems Ltd, React, Django..."
            rows={8}
          />
        </label>

        <div className="controls">
          <label className="field">
            <span>Template</span>
            <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Export format</span>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
            </select>
          </label>
        </div>

        <div className="actions">
          <button type="button" onClick={handlePreview} disabled={busy || !input.trim()}>
            {busy ? "Working..." : "Preview"}
          </button>
          <button type="button" onClick={handleExport} disabled={busy || !input.trim()}>
            Export {format.toUpperCase()}
          </button>
        </div>

        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="panel">
        <h2>Available Templates</h2>
        <div className="template-list">
          {templates.map((template) => (
            <article key={template.id} className="template-item">
              <strong>{template.name}</strong>
              <p>{template.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Preview / Export Result</h2>
        <pre className="output">{result || "No output yet."}</pre>
      </section>
    </main>
  );
}
