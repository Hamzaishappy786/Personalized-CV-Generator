# Personalized CV Generator

Lightweight web app for generating professional CVs from user input, with local fine-tuning support for a small model.

## Goal

- Turn messy user bio or resume notes into structured CV data
- Render multiple CV styles through templates
- Keep the frontend lightweight
- Run model training and inference locally on a small GPU setup

## Planned Stack

- Frontend: lightweight web UI, split into separate pages/files
- Backend: API for parsing, template selection, rendering, and export
- Model: local QLoRA fine-tuning and inference
- Storage: user-local files for uploads, generated resumes, and exports

## Model Choice

- Base model: `Qwen/Qwen2.5-0.5B-Instruct`
- Training approach: LoRA / QLoRA
- Use case: structured CV extraction and rewrite assistance

## Repository Structure

```text
cv-generator/
  frontend/
    index.html
    package.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
      routes/
        HomePage.tsx
        BuilderPage.tsx
        TemplatesPage.tsx
        PreviewPage.tsx
        DownloadPage.tsx
      components/
        Navbar.tsx
        TemplateCard.tsx
        CVPreview.tsx
        InputForm.tsx
      api/
        client.ts
      styles/
        globals.css
        theme.css

  backend/
    app/
      main.py
      api/
        cv_routes.py
        template_routes.py
        train_routes.py
      services/
        parser_service.py
        generation_service.py
        render_service.py
        export_service.py
      schemas/
        cv_schema.py
        request_schema.py
      utils/
        file_store.py
        validators.py
    requirements.txt

  model/
    data/
      sample_data.jsonl
      data.jsonl
    scripts/
      generate_data.py
      train_qlora.py
      test_inference.py
    checkpoints/
      qwen-0.5b-cv-lora/
    configs/
      train_config.py
      schema_prompt.py
    inference/
      infer.py

  shared/
    cv_schema.json
    template_schema.json
    constants.py

  storage/
    user_uploads/
    generated_cvs/
    exports/
```

## Build Order

1. Create shared CV schema
2. Build backend API skeleton
3. Build frontend pages
4. Wire frontend to backend
5. Add template rendering and export
6. Add training and inference scripts
7. Fine-tune the 0.5B model locally

## Commit Plan

Keep commits small and focused:

- `chore: scaffold project structure`
- `feat: add shared cv schema and backend skeleton`
- `feat: add lightweight frontend pages`
- `feat: wire frontend to backend api`
- `feat: add pdf/docx export`
- `feat: add qlora training and inference scripts`
- `docs: add setup and training instructions`

## Notes

- Keep the browser light; do not run model inference in the frontend
- Keep layout logic in templates, not in the model
- Prefer simple, reusable files over one large app file

## Local Setup

### Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Training

```powershell
pip install -r model\requirements.txt
python files\train_qlora.py
```

### Notes on GPU stack

- The model stack is pinned for `torch==1.12.1+cu113` and Python `3.10.11`
- Keep `bitsandbytes` out on Windows unless you know your local install supports it

### Quick Run Order

1. Start the backend on port `8000`
2. Start the frontend dev server
3. Paste a bio into the UI
4. Generate preview or export PDF/DOCX
