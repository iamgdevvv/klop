from fastapi import (  # pyright: ignore[reportMissingImports]
    APIRouter,
    HTTPException,
    status,
)

from .schemas import (
    ComprehensiveRequest,
    ComprehensiveResponse,
    CreateQuestionRequest,
    QuestionRequest,
    SimpleQuestionResponse,
)
from .services import QuestionService

router = APIRouter()
service = QuestionService()


@router.post(
    "/generate",
    response_model=SimpleQuestionResponse,
    status_code=status.HTTP_200_OK,
    summary="Create New Question",
)
async def create_new_question(payload: CreateQuestionRequest):
    try:
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


@router.post(
    "/comprehensive",
    response_model=ComprehensiveResponse,
    status_code=status.HTTP_200_OK,
    summary="Create Comprehensive Question",
    response_model_exclude_none=True,
)
async def create_comprehensive_question(
    payload: ComprehensiveRequest,
):
    try:
        return await service.create_comprehensive(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
