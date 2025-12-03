from typing import List, Optional

from pydantic import BaseModel, Field


# --- INPUT: Create New & Comprehensive
class CreateQuestionRequest(BaseModel):
    title: str = Field(
        ..., description="Role atau Judul Posisi", example="Backend Engineer"
    )
    description: str = Field(
        ...,
        description="Konteks, Level, atau Kriteria",
        example="Senior Level, Expert in Golang",
    )


# --- INPUT: Enhance
class QuestionRequest(BaseModel):
    title: str = Field(..., description="Role")
    description: str = Field(..., description="Konteks")
    question: str = Field(
        ..., description="Draft Pertanyaan", example="Tentang Goroutine"
    )


# --- OUTPUT: Simple ---
class SimpleQuestionResponse(BaseModel):
    question: str


# --- OUTPUT: Comprehensive ---
class AnswerOptionItem(BaseModel):
    answerOption: Optional[str] = None


class ComprehensiveResponse(BaseModel):
    question: str
    isAnswerOptions: Optional[bool] = None
    answerOptions: Optional[List[AnswerOptionItem]] = None
    expectedAnswer: str
