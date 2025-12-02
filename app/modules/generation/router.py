from fastapi import APIRouter, HTTPException, status

from app.shared.schemas import BaseResponse

from .schemas import GenerateData, GenerateRequest
from .service import GenerationService

router = APIRouter()
service = GenerationService()


@router.post(
    "/",
    response_model=BaseResponse[GenerateData],
    status_code=status.HTTP_201_CREATED,
    summary="Generate Questions",
)
async def generate_assessment(payload: GenerateRequest):
    try:
        # Panggil Service
        result = await service.generate_quiz(payload)

        # Bungkus dengan Envelope Pattern
        return BaseResponse(
            code=201,
            success=True,
            message="Assessment generated successfully",
            data=result,
        )
    except Exception as e:
        # Error 500 jika gagal generate/parsing
        raise HTTPException(
            status_code=500, detail=f"Failed to generate assessment: {str(e)}"
        )
