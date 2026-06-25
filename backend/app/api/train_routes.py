from fastapi import APIRouter

router = APIRouter()


@router.post("/status")
def training_status():
    return {"message": "training status endpoint"}


@router.post("/start")
def start_training():
    return {"message": "training start endpoint"}

