import logging

from openai import AsyncOpenAI  # pyright: ignore[reportMissingImports]
from tenacity import (  # pyright: ignore[reportMissingImports]
    retry,
    stop_after_attempt,
    wait_exponential,
)

from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMProviderError(Exception):
    """Custom exception ketika semua provider LLM gagal."""

    pass


class BaseLLMClient:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.KOLOSAL_API_KEY,
            base_url=settings.KOLOSAL_BASE_URL,
        )
        self.model = settings.KOLOSAL_MODEL

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def _call_kolosal(
        self,
        system_prompt: str,
        user_prompt: str,
        json_mode: bool,
        temperature: float,
    ) -> str:
        """Memanggil Primary LLM (Kolosal)."""
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ]

        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }

        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = await self.client.chat.completions.create(**kwargs)

        if not response.choices or not response.choices[0].message.content:
            raise ValueError("Empty response received from Kolosal LLM")

        return response.choices[0].message.content

    async def call_llm(
        self,
        system_prompt: str,
        user_prompt: str,
        json_mode: bool = False,
        temperature: float = 0.5,
    ) -> str:
        """
        Orkestrator utama: Gunakan Kolosal saja.
        """
        try:
            return await self._call_kolosal(
                system_prompt, user_prompt, json_mode, temperature
            )
        except Exception as kolosal_err:
            logger.error(f"Kolosal LLM failed: {kolosal_err}")
            raise
