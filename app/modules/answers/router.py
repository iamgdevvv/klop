from fastapi import APIRouter, HTTPException, status

from .schemas import (
    AnswerOptionsResponse,
    ExpectedAnswerResponse,
    ExpectedChoiceRequest,
    ExpectedEssayRequest,
)
from .services import AnswerService

router = APIRouter()
service = AnswerService()


@router.post(
    "/expected/essay",
    response_model=ExpectedAnswerResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Essay Key (Keywords)",
)
async def generate_essay_expected(payload: ExpectedEssayRequest):
    """
    Menghasilkan poin-poin kunci (rubrik) untuk penilaian Essay.
    """
    try:
        return await service.generate_essay_key(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/expected/choices",
    response_model=ExpectedAnswerResponse,
    status_code=status.HTTP_200_OK,
    summary="Select Correct Choice",
)
async def select_choice_expected(payload: ExpectedChoiceRequest):
    """
    Memilih satu jawaban paling benar dari daftar opsi (answerOptions) yang dikirim user.
    """
    try:
        return await service.select_best_choice(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/options",
    response_model=AnswerOptionsResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Answer Options",
)
async def generate_answer_options(payload: ExpectedEssayRequest):
    """
    Membuat 4 opsi jawaban pilihan ganda dari nol.
    """
    try:
        return await service.generate_options(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
