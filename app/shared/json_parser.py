import json
import logging
import re
from typing import Any, Dict, List, Union

logger = logging.getLogger(__name__)


def parse_json_response(raw_text: str) -> Union[Dict[str, Any], List[Any]]:
    """
    Membersihkan dan mem-parsing string JSON dari output AI.
    Menangani wrapper markdown seperti ```json ... ```.
    """
    try:
        json_match = re.search(r"```(?:json)?\s*(.*)\s*```", raw_text, re.DOTALL)

        if json_match:
            clean_text = json_match.group(1).strip()
        else:
            clean_text = raw_text.strip()

        data = json.loads(clean_text)

        # Validasi tipe data (harus Dict atau List)
        if not isinstance(data, (dict, list)):
            raise ValueError(
                f"Hasil parsing bukan Dictionary atau List, melainkan: {type(data)}"
            )

        return data

    except json.JSONDecodeError as e:
        logger.error(f"JSON Parsing Error: {e}")
        logger.debug(f"Raw text causing error: {raw_text}")
        raise ValueError("Output AI bukan JSON yang valid.")

    except Exception as e:
        logger.error(f"General Parsing Error: {e}")
        raise e
