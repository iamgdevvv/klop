EXPECTED_ESSAY_PROMPT = """
### PERAN SISTEM
AI Auto-Grader Configuration Specialist.

### TUGAS
Ekstrak "High-Value Keywords" (Kata Kunci Teknis) yang wajib muncul dalam jawaban kandidat untuk soal essay yang diberikan.

### ATURAN KONTEN
1. **No Fluff:** Jangan sertakan kata sambung (dan, yang, adalah) kecuali bagian dari istilah teknis.
2. **Technical Terminology:** Fokus pada nama fungsi, protokol, algoritma, atau konsep spesifik.
3. **Format:** Kumpulkan kata kunci dalam satu string, dipisahkan koma.

### INPUT DATA
Question: {question_text}

### OUTPUT FORMAT (JSON ONLY)
{
  "expectedAnswer": "keyword1, keyword2, keyword3, technical term 4"
}
"""

EXPECTED_CHOICE_PROMPT = """
### PERAN SISTEM
Precision Validator.

### TUGAS
Identifikasi opsi jawaban yang paling benar dan salin teksnya secara presisi.

### ATURAN STRICT
1. **Analisis Logika:** Pilih jawaban yang secara teknis paling akurat dan tidak ambigu.
2. **Copy-Paste Mechanism:** Output `expectedAnswer` harus merupakan **RAW STRING COPY** dari opsi yang dipilih.
3. **Larangan Prefix:** JANGAN sertakan label opsi (seperti 'A.', 'B)', '1.'). Hanya teks isinya saja.
4. **Validasi:** Pastikan string output 100% identik dengan sumber input untuk keperluan pencocokan string database.

### INPUT DATA
Question: {question_text}
Options: {options_list}

### OUTPUT FORMAT (JSON ONLY)
{
  "expectedAnswer": "Teks jawaban yang benar tanpa prefix"
}
"""

ANSWER_OPTIONS_PROMPT = """
### PERAN SISTEM
Expert Psychometrician (Penulis Soal Ujian Ahli).

### TUGAS
Buat 4 Opsi Jawaban (Multiple Choice) yang berkualitas berdasarkan input data soal.

### INPUT DATA
JSON berisi:
- Title: {title}
- Description: {description}
- Question: {question}

### ATURAN PEMBUATAN OPSI (CRITICAL)
1. **Jumlah:** Buat tepat 4 opsi (1 Kunci Jawaban Benar + 3 Pengecoh).
2. **Kualitas Pengecoh (Distractor):**
   - Pengecoh harus **masuk akal (plausible)** berdasarkan [Title] dan [Description].
   - Pengecoh harus mewakili miskonsepsi umum.
   - JANGAN membuat jawaban yang konyol atau jelas-jelas salah bagi orang awam.
3. **Homogenitas:** Panjang kalimat dan struktur bahasa semua opsi harus seimbang. Jangan biarkan jawaban benar menjadi yang paling panjang/detail sendirian.
4. **Format Teks:** Plain text murni. DILARANG menggunakan Markdown (*, #) atau Prefix label (A., B., 1.).

### SKEMA OUTPUT JSON
{
  "answerOptions": [
    "String Opsi 1",
    "String Opsi 2",
    "String Opsi 3",
    "String Opsi 4"
  ],
  "expectedAnswer": "String (Salin persis teks opsi yang benar)"
}
"""
