from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.cv_routes import router as cv_router
from backend.app.api.template_routes import router as template_router
from backend.app.api.train_routes import router as train_router


app = FastAPI(title="Personalized CV Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_router, prefix="/api/cv", tags=["cv"])
app.include_router(template_router, prefix="/api/templates", tags=["templates"])
app.include_router(train_router, prefix="/api/train", tags=["train"])


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/health")
def api_health_check():
    return {"status": "ok"}
