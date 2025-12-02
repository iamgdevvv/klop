# Klop! AI Assessment API

Platform backend untuk membuat soal asesmen esai berbasis skenario (Situational / Scenario-Based Essay) dengan dukungan LLM (Google Gemini) dan rubric penilaian positif/negatif secara terstruktur. Dibangun menggunakan FastAPI, menerapkan pola *Envelope Response*, parsing format custom berbasis YAML (TOON), serta extensible modular architecture.

---

## Daftar Isi
1. Ringkasan
2. Fitur Utama
3. Arsitektur & Struktur Folder
4. Teknologi & Dependensi
5. Setup Lingkungan & Instalasi
6. Konfigurasi Environment Variables
7. Menjalankan Aplikasi (Local & Docker)
8. Endpoint API
9. Format TOON / YAML
10. Alur Generate Assessment
11. Error Handling & Logging
12. Testing
13. Deployment Notes
14. Roadmap
15. Kontribusi
16. Lisensi

---

## 1. Ringkasan

Klop! AI Assessment API menyediakan endpoint untuk menghasilkan soal berbentuk esai yang terstruktur (scenario + task) dan rubric penilaian (indikator positif & red flag negatif). Output dari LLM dipaksa dalam bentuk YAML valid agar dapat diparse menjadi objek Python dan divalidasi oleh Pydantic.

---

## 2. Fitur Utama

- Generate soal esai situasional menggunakan LLM (Google Gemini).
- Prompt engineering dengan aturan format ketat (valid YAML tanpa code fences).
- Parsing format TOON/YAML menjadi schema Pydantic.
- Response Envelope Standar (code, success, message, data).
- CORS configurable untuk akses frontend.
- Retry otomatis terhadap kegagalan pemanggilan LLM (tenacity).
- Modular service layer (generation / scoring / insight / analytics bisa dikembangkan).
- Dukungan Docker untuk kemudahan deployment.
- Struktur siap untuk penambahan unit & integration tests.

---

## 3. Arsitektur & Struktur Folder

```
app/
  __init__.py
  main.py                  # Entry point FastAPI
  core/
    config.py              # Settings & environment
  shared/
    llm_client.py          # Wrapper Gemini API
    schemas.py             # BaseResponse (Envelope)
    toon_parser.py         # Parser & normalizer TOON/YAML
  modules/
    generation/
      prompts.py           # Sistem prompt YAML rules
      router.py            # Endpoint /api/v1/generate
      schemas.py           # Pydantic model GenerateRequest/GenerateData
      service.py           # Logika panggil LLM & parsing
    scoring/               # (placeholder future)
    insight/               # (placeholder future)
    analytics/             # (placeholder future)
tests/
  unit/                    # Unit tests
  integration/             # Integration tests
Dockerfile
requirements.txt
README.md
```

Desain mengikuti pola:
- `router` menangani HTTP layer.
- `service` fokus pada business logic (memanggil LLM + validasi).
- `shared` untuk reusable util (schema umum, parser, client LLM).
- `core` untuk konfigurasi sistem.

---

## 4. Teknologi & Dependensi

| Komponen | Deskripsi |
|----------|-----------|
| FastAPI | Framework web async |
| Uvicorn | ASGI server |
| google-genai | Client Google Gemini |
| tenacity | Retry logic (exponential backoff) |
| pydantic v2 & pydantic-settings | Validasi schema & environment |
| PyYAML | Parsing YAML (TOON format) |
| pytest / pytest-asyncio | Testing |
| httpx | Client HTTP async untuk test / future integrasi |

Lihat `requirements.txt` untuk versi lengkap.

---

## 5. Setup Lingkungan & Instalasi

Prasyarat:
- Python 3.11+
- Memiliki API Key Google Gemini
- Git & (opsional) Docker

Langkah:
```
git clone <repo_url>
cd klop-ai-be
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 6. Konfigurasi Environment Variables

Buat file `.env` di root project:

```
GEMINI_API_KEY=YOUR_GEMINI_KEY
GEMINI_MODEL=gemini-1.5-flash
```

Penyesuaian:
- Model bisa diganti sesuai ketersediaan (`gemini-1.5-pro`, dsb).
- Jangan commit `.env` ke repo publik.

`Settings` dibaca di `app/core/config.py` menggunakan `pydantic-settings`.

---

## 7. Menjalankan Aplikasi

Metode standar (direkomendasikan):
```
uvicorn app.main:app --reload
```
Akses:
- Swagger: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health

Jika terjadi masalah modul `app` tidak ditemukan:
```
PYTHONPATH=. uvicorn app.main:app --reload
```

Jangan gunakan `python app/main.py` untuk produksi; itu hanya fallback.

### Menjalankan dengan Docker

Build:
```
docker build -t klop-ai .
```

Run:
```
docker run -p 8000:8000 --env GEMINI_API_KEY=... --env GEMINI_MODEL=gemini-1.5-flash klop-ai
```

---

## 8. Endpoint API

### 8.1 Health Check
```
GET /health
Response:
{
  "status": "ok",
  "service": "Klop! AI",
  "version": "1.0.0"
}
```

### 8.2 Generate Assessment
```
POST /api/v1/generate
Content-Type: application/json
Body:
{
  "role": "Senior Backend Engineer",
  "location": "Jakarta, Indonesia",
  "level": "Senior",
  "criteria": "System Design & Scalability"
}
```

Response (Envelope):
```
{
  "code": 201,
  "success": true,
  "message": "Assessment generated successfully",
  "data": {
    "meta": { ... },
    "questions": [
      {
        "id": 1,
        "text": "…",
        "rubric": {
          "positive": [...],
          "negative": [...]
        }
      }
    ]
  }
}
```

Error format contoh:
```
{
  "code": 500,
  "success": false,
  "message": "Failed to generate assessment: AI Output is not in valid TOON/YAML format",
  "data": null
}
```

---

## 9. Format TOON / YAML

Untuk efisiensi token & kompatibilitas parser, LLM dipaksa output YAML murni tanpa code fences/backticks. Struktur minimal:

```yaml
meta:
  generated_at: 2024-01-01
  difficulty: Senior

questions:
  - id: 1
    text: |
      [Scenario paragraph 1]

      [Scenario paragraph 2]

      [Task / Question paragraph]
    rubric:
      positive:
        - Indicator 1
        - Indicator 2
      negative:
        - Red flag 1
        - Red flag 2
```

Parser:
- Menghapus code fences jika LLM masih membandel.
- Menormalkan kunci yang memiliki pola `[n]` (legacy prompt) menjadi kunci standar (contoh: `questions[1]` -> `questions`).
- Menggunakan `yaml.safe_load` untuk keamanan.

---

## 10. Alur Generate Assessment

1. Request masuk ke `router.py`.
2. Service `GenerationService.generate_quiz`:
   - Bangun `user_content` (menggabungkan role, location, level, criteria).
   - Panggil LLM via `BaseLLMClient.call_llm`.
3. LLM mengembalikan teks YAML (TOON).
4. `parse_toon_string`:
   - Bersihkan raw text.
   - Parse YAML → dict.
   - Normalisasi kunci.
5. Pydantic memvalidasi ke `GenerateData`.
6. Response dibungkus `BaseResponse[GenerateData]`.

Retry logic untuk LLM memakai `tenacity`:
- Maks 3 percobaan.
- Exponential backoff (2s → 4s → 8s).

---

## 11. Error Handling & Logging

Global exception handler (`main.py`):
- HTTPException → status sesuai.
- Exception umum → 500 dengan envelope standar.

Logging:
- Informasi generate (`logger.info`).
- Error parsing YAML atau kosong dari LLM → dicatat (`logger.error`).

Best Practice:
- Tambah log raw output potongan awal LLM saat debugging (jangan commit raw sensitif ke log produksi).

---

## 12. Testing

Struktur test:
- `tests/unit`: Menguji fungsi atomik (parser, client stub).
- `tests/integration`: Menguji endpoint end-to-end (mock LLM).

Menjalankan:
```
pytest
```

Contoh fokus test awal yang direkomendasikan:
- Parser: input YAML valid → dict.
- Parser: input dengan code fence → tetap lolos.
- Parser: kunci dengan `[count]` → dinormalisasi.
- Endpoint: `POST /api/v1/generate` dengan mock LLM menghasilkan schema valid.

---

## 13. Deployment Notes

- Pastikan variabel environment (API key) dikelola di secret manager (Vault / AWS Secrets / GCP Secret Manager).
- Gunakan image lean (`python:3.11-slim` sudah dipakai).
- Tambahkan mekanisme timeout & circuit breaker di masa depan untuk LLM.
- Observabilitas:
  - Tambah middleware metrics (Prometheus) jika diperlukan.
  - APM (OpenTelemetry) dapat ditambahkan mudah karena FastAPI mendukung instrumentation.

---

## 14. Roadmap

| Fase | Item |
|------|------|
| 1 | Penambahan modul scoring (otomatis evaluasi jawaban user) |
| 2 | Insight generation (analisis kekuatan / kelemahan berdasarkan jawaban) |
| 3 | Analytics dashboard (agg metrics) |
| 4 | Caching prompt + output untuk efisiensi biaya |
| 5 | Rate limiting & auth (JWT / API Key) |
| 6 | Multi-model fallback (Gemini → OpenAI / lokal) |
| 7 | Internationalization (EN/ID switching) |

---

## 15. Kontribusi

Langkah kontribusi:
1. Fork & clone.
2. Buat branch fitur (`feat/generation-enhancement`).
3. Tambah / update test.
4. Pastikan lint & test lulus.
5. Pull request dengan deskripsi jelas.

Format commit disarankan:
```
feat(generation): improve rubric richness
fix(parser): handle stray BOM char
docs(readme): add TOON explanation
```

---

## 16. Lisensi

(Tentukan lisensi: MIT / Apache-2.0 / Proprietary. Tambahkan file LICENSE terpisah.)

Contoh placeholder:
```
Hak cipta (c) 2024 Klop! AI. Seluruh hak cipta dilindungi.
```

---

## FAQ Singkat

| Pertanyaan | Jawaban |
|------------|---------|
| Mengapa YAML bukan JSON? | Block scalar (`|`) mudah untuk teks panjang & lebih ringkas tanpa escape newline. |
| Bagaimana jika LLM tetap output JSON? | Parser masih bisa memproses selama struktur cocok; namun prompt memaksa YAML. |
| Format `[key[count]]` hilang? | Dinormalisasi agar kompatibel dengan Pydantic schema standar. |
| Bisa tambah autentikasi? | Ya, tambahkan dependency `fastapi-users` atau middleware custom di future phase. |

---

## Kontak / Bantuan

Jika Anda membutuhkan bantuan integrasi atau menambah modul baru:
- Buat issue di repository.
- Sertakan payload request & potongan log relevan.

Selamat membangun dan mengembangkan Klop! AI Assessment! 🚀