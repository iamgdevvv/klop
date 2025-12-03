import logging

from app.shared.json_parser import parse_json_response
from app.shared.llm_client import BaseLLMClient

from .prompts import (
    ANSWER_OPTIONS_PROMPT,
    EXPECTED_CHOICE_PROMPT,
    EXPECTED_ESSAY_PROMPT,
)
from .schemas import (
    AnswerOptionsResponse,
    ExpectedAnswerResponse,
    ExpectedChoiceRequest,
    ExpectedEssayRequest,
)

logger = logging.getLogger(__name__)


class AnswerService:
    def __init__(self):
        self.llm = BaseLLMClient()

    async def _call_llm(self, prompt, content):
        raw = await self.llm.call_llm(prompt, content, json_mode=True, temperature=0.3)
        return parse_json_response(raw)

    # --- ENDPOINT /expected/essay ---
    async def generate_essay_key(
        self, payload: ExpectedEssayRequest
    ) -> ExpectedAnswerResponse:
        user_content = (
            f"Title: {payload.title}\n"
            f"Description: {payload.description}\n"
            f"Question: {payload.question}"
        )
        data = await self._call_llm(EXPECTED_ESSAY_PROMPT, user_content)
        return ExpectedAnswerResponse(**data)

    # --- ENDPOINT /expected/choices ---
    async def select_best_choice(
        self, payload: ExpectedChoiceRequest
    ) -> ExpectedAnswerResponse:
        # Format opsi agar mudah dibaca AI
        formatted_opts = "\n".join([f"- {opt}" for opt in payload.answerOptions])

        user_content = (
            f"Title: {payload.title}\n"
            f"Description: {payload.description}\n"
            f"Question: {payload.question}\n\n"
            f"AVAILABLE OPTIONS (Select One):\n{formatted_opts}"
        )

        data = await self._call_llm(EXPECTED_CHOICE_PROMPT, user_content)
        return ExpectedAnswerResponse(**data)

    # --- ENDPOINT /options (Generate Distractors) ---
    async def generate_options(
        self, payload: ExpectedEssayRequest
    ) -> AnswerOptionsResponse:
        # Note: Payload bisa pakai ExpectedEssayRequest karena inputnya sama (Title, Desc, Question)
        user_content = (
            f"Title: {payload.title}\n"
            f"Description: {payload.description}\n"
            f"Question: {payload.question}"
        )
        data = await self._call_llm(ANSWER_OPTIONS_PROMPT, user_content)
        return AnswerOptionsResponse(**data)
