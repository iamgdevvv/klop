GENERATE_QUESTION_PROMPT = """
### PERAN
Expert Assessment Architect.

### TUGAS
Ubah data 'Title' dan 'Description' menjadi Studi Kasus super ringkas.

### ATURAN PANJANG (STRICT)
Output MUTLAK maksimal 2 kalimat:
- Kalimat 1: Deskripsi Situasi/Masalah.
- Kalimat 2: Pertanyaan Keputusan/Tindakan.

### ATURAN FORMAT
1. Plain Text murni.
2. DILARANG: Markdown, Bullet points, Numbering.

### INPUT DATA
Title: {title}
Description: {description}

### OUTPUT FORMAT (JSON ONLY)
{
  "question": "Sistem X mengalami load tinggi saat flash sale (Situasi). Apa strategi caching yang paling tepat untuk mengurangi beban database tanpa mengorbankan konsistensi data stok?"
}
"""

ENHANCE_QUESTION_PROMPT = """
### PERAN
Senior Editor.

### TUGAS
Rewrite draft pertanyaan menjadi level HOTS (Analisis/Evaluasi) tanpa menambah panjang teks.

### ATURAN REWRITE
1. **Limitasi:** Hasil rewrite WAJIB tetap maksimal 2 kalimat. Padatkan diksi yang bertele-tele.
2. **Logic Upgrade:** Ubah pertanyaan hafalan menjadi pertanyaan analisis keputusan.
3. **Clean Up:** Hapus semua simbol markdown (*, #, -).

### INPUT DRAFT
{draft_question}

### OUTPUT FORMAT (JSON ONLY)
{
  "question": "Teks hasil rewrite yang tajam dan padat (Max 2 kalimat)..."
}
"""

COMPREHENSIVE_PROMPT = """
### PERAN
Lead Technical Assessor.

### TUGAS
Buat paket soal lengkap (Soal + Opsi + Kunci) berdasarkan parameter input.

### PARAMETER
- Topik: {title}
- Konteks: {description}
- Tipe: {requested_type} ("ESSAY" / "MULTIPLE_CHOICE")

### ATURAN KONTEN
1. **Panjang Pertanyaan:** STRICT Maksimal 2 kalimat (Situasi + Pertanyaan).
2. **Format Teks:** Plain text murni, DILARANG Markdown.
3. **Logika Pengecoh:** Opsi salah harus logis/plausible.

### LOGIKA OUTPUT (JSON)
A. TIPE "ESSAY":
   - `answerOptions`: [] (Array kosong).
   - `expectedAnswer`: Tuliskan HANYA kata kunci/konsep teknis wajib (rubrik penilaian), dipisahkan koma. JANGAN berupa kalimat narasi panjang.

B. TIPE "MULTIPLE_CHOICE":
   - `answerOptions`: Array 4 teks [Opsi A, B, C, D].
   - `expectedAnswer`: Copy-paste teks opsi yang benar.

### OUTPUT SCHEMA (JSON ONLY)
{
  "question": "String (Max 2 kalimat)",
  "isAnswerOptions": true/false,
  "answerOptions": ["String", "String", "String", "String"],
  "expectedAnswer": "String"
}
"""
