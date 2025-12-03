# import logging

# from google import genai
# from google.genai import types
# from tenacity import retry, stop_after_attempt, wait_exponential

# from app.core.config import settings

# # Setup logger
# logger = logging.getLogger(__name__)


# class BaseLLMClient:
#     def __init__(self):
#         # Inisialisasi Client Google Gen AI
#         self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
#         self.model = settings.GEMINI_MODEL

#     @retry(
#         stop=stop_after_attempt(3),
#         wait=wait_exponential(multiplier=1, min=2, max=10),
#         reraise=True,
#     )
#     async def call_llm(
#         self,
#         system_prompt: str,
#         user_prompt: str,
#         json_mode: bool = False,
#         temperature: float = 0.5,
#     ) -> str:
#         """
#         Memanggil API Gemini dengan dukungan System Instruction & JSON Mode.
#         """
#         try:
#             # 1. Konfigurasi Generasi
#             config = types.GenerateContentConfig(
#                 system_instruction=system_prompt,
#                 temperature=temperature,
#                 # Jika json_mode True, paksa output JSON murni
#                 response_mime_type="application/json" if json_mode else "text/plain",
#             )

#             # 2. Panggil Model secara Async (.aio)
#             response = await self.client.aio.models.generate_content(
#                 model=self.model, contents=user_prompt, config=config
#             )

#             # 3. Return text result
#             if response.text:
#                 return response.text
#             else:
#                 raise ValueError("Empty response from LLM")

#         except Exception as e:
#             logger.error(f"LLM Call Failed: {str(e)}")
#             raise e


import logging

from openai import AsyncOpenAI  # <--- Ganti library
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

# Setup logger
logger = logging.getLogger(__name__)


class BaseLLMClient:
    def __init__(self):
        # Inisialisasi Client OpenAI tapi diarahkan ke server Kolosal
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
    async def call_llm(
        self,
        system_prompt: str,
        user_prompt: str,
        json_mode: bool = False,
        temperature: float = 0.5,
    ) -> str:
        """
        Memanggil API Kolosal (Qwen) dengan struktur OpenAI.
        """
        try:
            # 1. Susun Pesan (Format OpenAI)
            # Berbeda dengan Gemini, di sini System Prompt masuk ke dalam list messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]

            # 2. Konfigurasi Parameter Tambahan
            kwargs = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
            }

            # Jika JSON mode aktif
            if json_mode:
                # Memaksa model mengeluarkan JSON (fitur ini tergantung dukungan model Qwen spesifik)
                kwargs["response_format"] = {"type": "json_object"}

            # 3. Panggil Model secara Async
            # Perhatikan syntax: chat.completions.create
            response = await self.client.chat.completions.create(**kwargs)

            # 4. Ambil dan Return hasil
            result_text = response.choices[0].message.content

            if result_text:
                return result_text
            else:
                raise ValueError("Empty response from LLM")

        except Exception as e:
            logger.error(f"LLM Call Failed: {str(e)}")
            raise e
