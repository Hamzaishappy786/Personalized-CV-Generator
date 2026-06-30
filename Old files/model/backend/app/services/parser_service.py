from app.schemas.cv_schema import CVData


def parse_input(text: str) -> CVData:
    return CVData(summary=text)

