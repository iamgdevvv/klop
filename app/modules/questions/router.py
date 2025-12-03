from fastapi import APIRouter, HTTPException, status

# Import Schemas & Service
from .schemas import (
    CreateQuestionRequest,
    QuestionRequest,
    SimpleQuestionResponse,
)
from .services import QuestionService

router = APIRouter()
service = QuestionService()


@router.post(
    "/generate",
    response_model=SimpleQuestionResponse,  # <-- Langsung Model Data
    status_code=status.HTTP_200_OK,
    summary="Create New Question",
)
async def create_new_question(payload: CreateQuestionRequest):
    try:
        # Langsung return hasil dari service
        return await service.create_question(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/enhance",
    response_model=SimpleQuestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Enhance Existing Question",
)
async def enhance_question(payload: QuestionRequest):
    try:
        return await service.enhance_question(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
