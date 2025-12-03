from typing import List

from pydantic import BaseModel, Field


# --- INPUT: ESSAY ---
class ExpectedEssayRequest(BaseModel):
    title: str = Field(..., description="Role")
    description: str = Field(..., description="Context")
    question: str = Field(..., description="Pertanyaan Essay")


# --- INPUT: CHOICES ---
class ExpectedChoiceRequest(BaseModel):
    title: str = Field(..., description="Role")
    description: str = Field(..., description="Context")
    question: str = Field(..., description="Pertanyaan Pilihan Ganda")
    answerOptions: List[str] = Field(
        ..., min_items=4, description="List opsi jawaban yang tersedia"
    )


# --- OUTPUT ---
class ExpectedAnswerResponse(BaseModel):
    expectedAnswer: str = Field(
        ..., description="Kunci jawaban (Keywords atau Pilihan Opsi)"
    )


class AnswerOptionsResponse(BaseModel):
    answerOption: List[str]
    expectedAnswer: str
