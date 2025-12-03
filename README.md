# Klop! AI Assessment API

Backend platform untuk menghasilkan soal asesmen esai berbasis skenario (Scenario-Based Essay) dengan dukungan LLM (Google Gemini) dan rubric penilaian positif/negatif yang terstruktur. Dibangun dengan FastAPI, menerapkan pola Envelope Response, parser YAML (TOON), serta arsitektur modular yang mudah diperluas.

---

## Daftar Isi
1. Ringkasan
2. Fitur Utama
3. Arsitektur & Struktur Folder
4. Teknologi & Dependensi
5. Persiapan Lingkungan
6. Instalasi
7. Konfigurasi Environment Variables
8. Menjalankan Aplikasi (Local & Docker)
9. Endpoint API
10. Format TOON (YAML)
11. Alur Generate Assessment
12. Error Handling & Logging
13. Testing
14. Deployment Notes
15. Roadmap
16. Kontribusi
17. Lisensi
18. FAQ
19. Kontak

---

## 1) Ringkasan

Klop! AI Assessment API menyediakan endpoint untuk:
- Menghasilkan soal esai situasional (scenario + task).
- Menghasilkan rubric penilaian terstruktur (indikator positif dan red flag negatif).
- Memaksa output LLM dalam format YAML valid untuk diparse dan divalidasi dengan Pydantic.

---

## 2) Fitur Utama

- Generate soal esai situasional menggunakan LLM (Google Gemini).
- Prompt engineering dengan aturan format ketat (YAML murni tanpa code fences).
- Parsing YAML (TOON) menjadi schema Pydantic.
- Envelope response konsisten: `code`, `success`, `message`, `data`.
- CORS bisa dikonfigurasi untuk akses frontend.
- Retry otomatis pemanggilan LLM (exponential backoff).
- Modular service layer: generation / scoring / insight / analytics.
- Dukungan Docker untuk kemudahan deployment.
- Siap untuk pengujian unit dan integrasi.

---

## 3) Arsitektur & Struktur Folder

Struktur direktori inti:
- `app/main.py`: Entry point FastAPI.
- `app/core/config.py`: Konfigurasi environment & settings.
- `app/shared/llm_client.py`: Wrapper Gemini API.
- `app/shared/schemas.py`: Envelope response (`BaseResponse`).
- `app/shared/toon_parser.py`: Parser & normalizer TOON/YAML.
- `app/modules/generation/`: Modul generate assessment (prompts, router, schemas, service).
- `tests/`: Unit dan integration tests.
- `Dockerfile`, `requirements.txt`, `README.md`.

Desain:
- `router`: HTTP layer (request/response).
- `service`: Business logic (memanggil LLM + validasi).
- `shared`: Reusable util (schema umum, parser, client LLM).
- `core`: Konfigurasi sistem dan environment.

---

## 4) Teknologi & Dependensi

Komponen utama:
- FastAPI (web framework async)
- Uvicorn (ASGI server)
- google-genai (client Google Gemini)
- tenacity (retry logic)
- pydantic v2 & pydantic-settings (validasi schema & environment)
- PyYAML (parsing YAML)
- pytest / pytest-asyncio (testing)
- httpx (HTTP client async)

Lihat file `requirements.txt` untuk versi lengkap paket.

---

## 5) Persiapan Lingkungan

Prasyarat:
- Python 3.11 atau lebih baru
- API Key Google Gemini (aktif)
- Git
- Docker (opsional, untuk menjalankan dalam container)

---

## 6) Instalasi

Langkah:
- Clone repository: gunakan perintah `git clone` dengan URL repo Anda.
- Masuk ke folder proyek: `cd klop-ai-be`.
- Buat virtual environment: `python -m venv .venv`.
- Aktifkan virtual environment: `source .venv/bin/activate` (Linux/Mac) atau `.venv\Scripts\activate` (Windows).
- Install dependencies: `pip install -r requirements.txt`.

---

## 7) Konfigurasi Environment Variables

Buat file `.env` di root project dengan isi:
- `GEMINI_API_KEY=YOUR_GEMINI_KEY`
- `GEMINI_MODEL=gemini-1.5-flash` (atau `gemini-1.5-pro` sesuai kebutuhan)

Catatan:
- Jangan commit `.env` ke repository publik.
- `Settings` dibaca di `app/core/config.py` menggunakan `pydantic-settings`.

---

## 8) Menjalankan Aplikasi

A. Mode lokal (direkomendasikan):
- Jalankan: `uvicorn app.main:app --reload`
- Akses:
  - Swagger: http://localhost:8000/docs
  - Redoc: http://localhost:8000/redoc
  - Health: http://localhost:8000/health
- Jika modul `app` tidak ditemukan, jalankan dengan `PYTHONPATH=.` sebelum perintah uvicorn.

B. Mode Docker:
- Build image: `docker build -t klop-ai .`
- Jalankan container:
  - `docker run -p 8000:8000 --env GEMINI_API_KEY=YOUR_KEY --env GEMINI_MODEL=gemini-1.5-flash klop-ai`

Catatan:
- Hindari menjalankan `python app/main.py` untuk produksi; gunakan Uvicorn/ASGI server.

---

## 9) Endpoint API

A. Health Check
- Method: GET
- Path: `/health`
- Response contoh:
  - `{"status":"ok","service":"Klop! AI","version":"1.0.0"}`

B. Generate Assessment
- Method: POST
- Path: `/api/v1/generate`
- Header: `Content-Type: application/json`
- Body contoh:
  - `{"role":"Senior Backend Engineer","location":"Jakarta, Indonesia","level":"Senior","criteria":"System Design & Scalability"}`
- Response (Envelope) contoh:
  - `{"code":201,"success":true,"message":"Assessment generated successfully","data":{"meta":{},"questions":[{"id":1,"text":"...","rubric":{"positive":["..."],"negative":["..."]}}]}}`
- Error format contoh:
  - `{"code":500,"success":false,"message":"Failed to generate assessment: AI Output is not in valid TOON/YAML format","data":null}`

---

## 10) Format TOON (YAML)

Output LLM dipaksa menjadi YAML murni (tanpa code fences/backticks) untuk efisiensi token dan kompatibilitas parser.

Struktur minimal:
- `meta`: informasi meta (tanggal, tingkat kesulitan, dll).
- `questions`: daftar pertanyaan; setiap item memiliki:
  - `id`: nomor urut
  - `text`: narasi skenario dan task (menggunakan block scalar agar rapi)
  - `rubric.positive`: daftar indikator penilaian positif
  - `rubric.negative`: daftar red flag (indikator negatif)

Perilaku parser:
- Menghapus code fences/backticks bila masih muncul pada output LLM.
- Menormalkan kunci legacy yang memiliki pola `[n]` (mis. `questions[1]`) menjadi kunci standar (`questions`).
- Menggunakan `yaml.safe_load` untuk keamanan.

Best practices untuk prompt:
- Gunakan instruksi eksplisit: “Output harus YAML murni, tanpa penjelasan, tanpa code fences”.
- Gunakan contoh YAML sebagai template dengan variabel kosong untuk dipopulasi.
- Hindari karakter khusus yang dapat mengacaukan indentasi.

---

## 11) Alur Generate Assessment

1. Request masuk ke `modules/generation/router.py`.
2. Service `GenerationService.generate_quiz`:
   - Membangun `user_content` dari `role`, `location`, `level`, dan `criteria`.
   - Memanggil LLM via `BaseLLMClient.call_llm`.
3. LLM mengembalikan YAML (TOON).
4. `parse_toon_string`:
   - Membersihkan raw text (hilangkan fences).
   - Parse YAML menjadi `dict`.
   - Normalisasi kunci dan struktur.
5. Validasi Pydantic ke model `GenerateData`.
6. Response dibungkus dalam `BaseResponse[GenerateData]`.

Retry logic:
- Maksimal 3 percobaan.
- Exponential backoff (2s → 4s → 8s).

---

## 12) Error Handling & Logging

Global exception handler (di `main.py`):
- `HTTPException`: status sesuai.
- Exception umum: `500` dengan envelope standar.

Logging:
- `info`: peristiwa generate, metadata, dan flow.
- `error`: parsing YAML gagal, output LLM kosong, kegagalan panggilan LLM, dll.

Tips:
- Saat debugging, log potongan awal raw output LLM (hindari menyimpan data sensitif di produksi).
- Tambahkan correlation/request ID untuk pelacakan.

---

## 13) Testing

Struktur:
- `tests/unit`: parser, client stub, helpers.
- `tests/integration`: endpoint end-to-end (mock LLM).

Menjalankan:
- `pytest`

Rekomendasi cakupan awal:
- Parser: YAML valid → dict.
- Parser: output dengan code fence → tetap lolos.
- Parser: kunci `[count]` → dinormalisasi.
- Endpoint: `POST /api/v1/generate` dengan mock LLM menghasilkan schema valid.
- Service: retry pada kegagalan LLM dengan tenacity.

---

## 14) Deployment Notes

Keamanan & konfigurasi:
- Letakkan secrets (API key) di secret manager (Vault/AWS Secrets/GCP Secret Manager).
- Gunakan image lean (contoh: `python:3.11-slim`).

Reliability:
- Tambahkan timeout & circuit breaker untuk pemanggilan LLM.
- Siapkan strategi fallback (cache output terakhir atau default template).

Observabilitas:
- Middleware metrics (Prometheus) bila diperlukan.
- APM/Tracing (OpenTelemetry) mudah diintegrasikan karena FastAPI mendukung instrumentation.

---

## 15) Roadmap

Fase pengembangan:
1. Modul scoring: evaluasi jawaban otomatis (rubric-based).
2. Insight generation: analisis kekuatan/kelemahan berdasarkan jawaban.
3. Analytics dashboard: agregasi metrik dan tren.
4. Caching prompt+output: efisiensi biaya & latency.
5. Rate limiting & auth: JWT/API Key.
6. Multi-model fallback: Gemini → OpenAI → model lokal.
7. Internationalization: dukungan EN/ID switching.

---

## 16) Kontribusi

Langkah:
1. Fork & clone repository.
2. Buat branch fitur: gunakan konvensi `feat/...`, `fix/...`, `docs/...`.
3. Tambahkan/ubah tests sesuai perubahan.
4. Pastikan lint & tests lulus.
5. Buat Pull Request dengan deskripsi jelas, lampirkan contoh payload dan hasil.

Format commit disarankan:
- `feat(generation): improve rubric richness`
- `fix(parser): handle stray BOM char`
- `docs(readme): add TOON explanation`

Kode etik:
- Ikuti style Python (PEP 8) dan tipe anotasi bila memungkinkan.
- Hindari hardcode secret dan konfigurasi environment.

---

## 17) Lisensi

Pilih lisensi (MIT/Apache-2.0/Proprietary) dan tambahkan file `LICENSE`.

Contoh placeholder:
- Hak cipta (c) 2024 Klop! AI. Seluruh hak cipta dilindungi.

---

## 18) FAQ

Tanya: Mengapa YAML bukan JSON?
- Jawab: Block scalar (`|`) memudahkan teks panjang dan lebih ringkas tanpa escape newline.

Tanya: Bagaimana jika LLM tetap output JSON?
- Jawab: Parser berusaha memproses selama struktur cocok; namun prompt memaksa YAML untuk konsistensi.

Tanya: Format `[key[count]]` hilang?
- Jawab: Dinormalisasi agar kompatibel dengan schema Pydantic standar.

Tanya: Bisakah ditambah autentikasi?
- Jawab: Ya, tambahkan middleware atau integrasi `fastapi-users` pada fase berikutnya.

---

## 19) Kontak

Membutuhkan bantuan integrasi atau ingin menambah modul baru?
- Buat issue di repository dan sertakan payload request serta potongan log relevan.

Selamat membangun dan mengembangkan Klop! AI Assessment! 🚀