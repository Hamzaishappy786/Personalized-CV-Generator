from fastapi import FastAPI

from app.api.cv_routes import router as cv_router
from app.api.template_routes import router as template_router
from app.api.train_routes import router as train_router


app = FastAPI(title="Personalized CV Generator")

app.include_router(cv_router, prefix="/api/cv", tags=["cv"])
app.include_router(template_router, prefix="/api/templates", tags=["templates"])
app.include_router(train_router, prefix="/api/train", tags=["train"])


@app.get("/health")
def health_check():
    return {"status": "ok"}

