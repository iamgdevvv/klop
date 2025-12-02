from typing import List, Literal, Optional

from pydantic import BaseModel, Field


# --- Input Request ---
class GenerateRequest(BaseModel):
    role: str = Field(..., example="Senior Backend Engineer")
    location: str = Field(..., example="Jakarta, Indonesia")
    level: str = Field(..., example="Senior")
    criteria: str = Field(..., example="System Design & Scalability")
    question_count: int = Field(1, example=1)
    question_type: Literal["essay", "multiple_choice"] = Field(
        ...,
        description="Tipe soal yang diinginkan: 'essay' atau 'multiple_choice'",
        example="multiple_choice",
    )


# --- Output Response Components ---


# 1. Model Baru untuk Opsi Pilihan Ganda
class OptionItem(BaseModel):
    key: str = Field(..., description="Label pilihan (A, B, C, D)", example="A")
    text: str = Field(
        ..., description="Isi teks jawaban", example="Melakukan rollback database."
    )


class RubricItem(BaseModel):
    positive: List[str] = Field(
        default=[], description="Indikator jawaban benar (Essay)"
    )
    negative: List[str] = Field(
        default=[], description="Red flag jawaban salah (Essay)"
    )


class QuestionItem(BaseModel):
    id: int
    text: str = Field(..., description="Skenario dan Pertanyaan")

    # Field Khusus ESSAY
    rubric: Optional[RubricItem] = None

    # Field Khusus PILIHAN GANDA
    options: Optional[List[OptionItem]] = Field(
        None, description="List object pilihan ganda dengan key dan text terpisah"
    )

    correct_answer: Optional[str] = Field(None, description="Kunci jawaban, misal 'A'")
    explanation: Optional[str] = Field(
        None, description="Penjelasan kenapa jawaban itu benar"
    )


class GenerateData(BaseModel):
    meta: dict = Field(default_factory=dict)
    questions: List[QuestionItem]
