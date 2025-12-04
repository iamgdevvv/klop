# Sistem Penilaian AI Klop!

Platform penilaian teknis berbasis AI yang menghasilkan pertanyaan kontekstual dan menyediakan penilaian otomatis dengan mekanisme fallback yang cerdas.

## Fitur

### Pembuatan Pertanyaan
- **Pembuatan Pertanyaan Cerdas**: Mengubah deskripsi peran menjadi studi kasus tingkat HOTS
- **Peningkatan Pertanyaan**: Meningkatkan draf pertanyaan ke tingkat pemikiran analitis
- **Penilaian Komprehensif**: Menghasilkan paket pertanyaan lengkap dengan format pilihan ganda atau esai

### Penilaian Otomatis
- **Evaluasi Adaptif**: Penilaian cerdas untuk respons pilihan ganda dan esai
- **Pencocokan Kata Kunci**: Analisis semantik untuk jawaban esai dengan ambang batas 70%
- **Pemrosesan Batch**: Menilai beberapa pertanyaan dalam satu permintaan

## Stack Teknologi

- **Framework**: FastAPI
- **Bahasa**: Python 3.11+
- **Integrasi AI**: Kolosal AI (Utama) + Google Gemini (Cadangan)
- **Validasi**: Pydantic
- **HTTP Client**: Klien async yang kompatibel dengan OpenAI

## Struktur Proyek

```
klop-ai-be/
├── app/
│   ├── core/
│   │   ├── config.py          # Pengaturan dan konfigurasi lingkungan
│   │   └── security.py        # Utilitas autentikasi dan keamanan
│   ├── modules/
│   │   ├── questions/         # Modul pembuatan pertanyaan
│   │   │   ├── router.py      # Endpoint API
│   │   │   ├── services.py    # Logika bisnis
│   │   │   ├── schemas.py     # Model Request/Response
│   │   │   └── prompts.py     # Template prompt LLM
│   │   ├── assessments/       # Modul penilaian
│   │   │   ├── router.py      # Endpoint penilaian
│   │   │   ├── services.py    # Logika penilaian
│   │   │   ├── schemas.py     # Model penilaian
│   │   │   └── prompts.py     # Prompt penilaian
│   │   └── answers/           # Modul pemrosesan jawaban
│   │       ├── router.py      # Endpoint jawaban
│   │       ├── services.py    # Logika pemrosesan jawaban
│   │       ├── schemas.py     # Model jawaban
│   │       └── prompts.py     # Prompt jawaban
│   └── shared/
│       ├── llm_client.py      # Klien LLM dengan fallback
│       └── json_parser.py     # Utilitas parsing respons
├── Dockerfile                 # Konfigurasi kontainerisasi Docker
├── .env.example              # Template variabel lingkungan
└── main.py                   # Titik masuk aplikasi

```
## ⚙️ Pengaturan

### 1. Instalasi Dependensi

```bash
# Clone repository
git clone https://github.com/attmhd/klop-ai-be
cd klop-ai-be

# Buat virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# atau
.venv\Scripts\activate     # Windows

# Install paket
pip install -r requirements.txt
```

### 2. Konfigurasi Lingkungan

Salin `.env.example` ke `.env` dan konfigurasi:

```bash
cp .env.example .env
```

**Variabel yang Diperlukan:**
```env
# LLM Utama (Kolosal)
KOLOSAL_API_KEY=your-kolosal-api-key
KOLOSAL_BASE_URL=https://api.kolosal.ai/v1
KOLOSAL_MODEL=qwen2.5-7b-instruct

# LLM Cadangan (Gemini) - Opsional tetapi direkomendasikan
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Instalasi SDK Gemini (untuk fallback)

```bash
pip install google-genai
```

### 4. Jalankan Aplikasi

```bash
uvicorn main:app --reload
# Server dimulai di http://localhost:8000
# Dokumentasi API di http://localhost:8000/docs
```

### 5. Deployment dengan Docker

```bash
# Build Docker image
docker build -t klop-ai-be .

# Jalankan container
docker run -p 8000:8000 --env-file .env klop-ai-be

```

## Endpoint API

### Modul Pertanyaan (`/questions`)

| Metode | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/generate` | Buat pertanyaan dari peran & konteks |
| POST | `/enhance` | Tingkatkan draf pertanyaan yang ada |
| POST | `/comprehensive` | Buat paket penilaian lengkap |

### Modul Penilaian (`/assessments`)

| Metode | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/score` | Nilai respons kandidat |

## Integrasi LLM

### Arsitektur Fallback
- **Utama**: Kolosal AI (kompatibel OpenAI)
- **Cadangan**: Google Gemini (dipicu otomatis saat Kolosal gagal)
- **Logika Retry**: 3 percobaan dengan backoff eksponensial

### Penanganan Respons
- Mode JSON dipaksakan untuk output terstruktur
- Penghapusan pembungkus markdown otomatis
- Validasi tipe sebelum konstruksi skema

## Contoh Penggunaan

### Buat Pertanyaan
```json
POST /questions/generate
{
  "title": "Backend Developer",
  "description": "Platform e-commerce dengan traffic tinggi"
}

Respons:
{
  "question": "Platform e-commerce mengalami spike traffic 300% saat flash sale. Bagaimana Anda merancang strategi caching untuk mempertahankan performa tanpa mengorbankan konsistensi data inventory?"
}
```

### Penilaian Skor
```json
POST /assessments/score
{
  "title": "Penilaian Backend Developer",
  "description": "Evaluasi teknis untuk posisi senior",
  "questions": [
    {
      "question": "Jelaskan manfaat arsitektur microservices",
      "answer": "Microservices menyediakan skalabilitas, independensi...",
      "expectedAnswer": "skalabilitas, independensi, isolasi kesalahan, keragaman teknologi"
    }
  ]
}

Respons:
{
  "summary": "Kandidat menunjukkan pemahaman solid tentang konsep microservices dengan akurasi 85%.",
  "questions": [
    {
      "question": "Jelaskan manfaat arsitektur microservices",
      "answer": "Microservices menyediakan skalabilitas, independensi...",
      "isAnswerCorrect": true
    }
  ]
}
```

## Konfigurasi

### Pengaturan LLM
- **Temperature**: 0.2-0.5 untuk output yang konsisten
- **Mode JSON**: Dipaksakan untuk semua respons terstruktur
- **Token Maksimum**: Dikonfigurasi sesuai kebutuhan endpoint

### Rekayasa Prompt
- **Level HOTS**: Pertanyaan analisis dan evaluasi
- **Batas Panjang**: Maksimum 2 kalimat per pertanyaan
- **Teks Biasa**: Tidak ada format markdown dalam output

## Penanganan Error

- **Error Validasi**: Pesan validasi tingkat field yang jelas
- **Kegagalan LLM**: Fallback otomatis dengan logging detail
- **Parsing Respons**: Ekstraksi dan validasi JSON yang robust
- **Keamanan Tipe**: Pengecekan tipe runtime sebelum konstruksi model

## Pemeriksaan Kesehatan

```bash
curl http://localhost:8000/health
```

## Penulis

**Tim Klop!**


## Lisensi
Dilisensikan di bawah Apache License, Version 2.0 ("Lisensi");
Anda tidak boleh menggunakan file ini kecuali sesuai dengan Lisensi.
Anda dapat memperoleh salinan Lisensi di

    http://www.apache.org/licenses/LICENSE-2.0

Kecuali disyaratkan oleh hukum yang berlaku atau disetujui secara tertulis, perangkat lunak
yang didistribusikan di bawah Lisensi didistribusikan "SEBAGAIMANA ADANYA",
TANPA JAMINAN ATAU KETENTUAN APA PUN, baik tersurat maupun tersirat.
Lihat Lisensi untuk bahasa tertentu yang mengatur izin dan
pembatasan di bawah Lisensi.
