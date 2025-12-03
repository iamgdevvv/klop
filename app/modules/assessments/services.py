import logging

from app.shared.json_parser import parse_json_response
from app.shared.llm_client import BaseLLMClient

from .prompts import SCORING_PROMPT
from .schemas import AssessmentRequest, AssessmentResponse

logger = logging.getLogger(__name__)


class AssessmentService:
    def __init__(self):
        self.llm = BaseLLMClient()

    async def score_assessment(self, payload: AssessmentRequest) -> AssessmentResponse:
        try:
            items_str = ""
            for idx, item in enumerate(payload.questions, 1):
                items_str += (
                    f"\n--- ITEM {idx} ---\n"
                    f"Question: {item.question}\n"
                    f"Candidate Answer: {item.answer}\n"
                    f"Expected Answer (Key): {item.expectedAnswer}\n"
                )

            user_content = (
                f"Title: {payload.title}\n"
                f"Description: {payload.description}\n"
                f"ITEMS TO SCORE:{items_str}"
            )

            logger.info(
                f"Scoring batch of {len(payload.questions)} items for {payload.title}"
            )

            raw_response = await self.llm.call_llm(
                system_prompt=SCORING_PROMPT,
                user_prompt=user_content,
                json_mode=True,
                temperature=0.2,
            )

            data = parse_json_response(raw_response)

            return AssessmentResponse(**data)

        except Exception as e:
            logger.error(f"Assessment Scoring Error: {str(e)}")
            raise e
