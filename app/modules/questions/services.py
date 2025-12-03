import logging

from app.shared.llm_client import BaseLLMClient
from app.shared.toon_parser import parse_toon_string

from .prompts import (
    ENHANCE_QUESTION_PROMPT,
    GENERATE_QUESTION_PROMPT,
)

# Import Schema & Prompts
from .schemas import (
    CreateQuestionRequest,
    QuestionRequest,
    SimpleQuestionResponse,
)

logger = logging.getLogger(__name__)


class QuestionService:
    def __init__(self):
        self.llm = BaseLLMClient()

    # --- Helper Private untuk memanggil LLM ---
    async def _call_llm(self, system_prompt: str, user_content: str) -> dict:
        try:
            # json_mode=False + parse_toon_string lebih aman untuk output fence block
            raw_response = await self.llm.call_llm(
                system_prompt=system_prompt,
                user_prompt=user_content,
                json_mode=False,
                temperature=0.4,  # Kreativitas moderat
            )
            return parse_toon_string(raw_response)
        except Exception as e:
            logger.error(f"LLM Call Error: {str(e)}")
            raise e

    # --- CREATE NEW (Generate Question Only) ---
    async def create_question(
        self, payload: CreateQuestionRequest
    ) -> SimpleQuestionResponse:
        user_content = f"Title: {payload.title}\nDescription: {payload.description}"
        data = await self._call_llm(GENERATE_QUESTION_PROMPT, user_content)
        return SimpleQuestionResponse(**data)

    # --- ENHANCE (Rewrite Question) ---
    async def enhance_question(
        self, payload: QuestionRequest
    ) -> SimpleQuestionResponse:
        user_content = (
            f"Title: {payload.title}\n"
            f"Description: {payload.description}\n"
            f"Draft Question: {payload.question}"
        )
        data = await self._call_llm(ENHANCE_QUESTION_PROMPT, user_content)
        return SimpleQuestionResponse(**data)
