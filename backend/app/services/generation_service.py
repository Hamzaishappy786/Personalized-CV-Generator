from app.schemas.cv_schema import CVData


def generate_cv_data(raw_text: str) -> CVData:
    return CVData(summary=raw_text)

