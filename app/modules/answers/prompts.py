EXPECTED_ESSAY_PROMPT = """
### PERAN SISTEM
Technical Grader & Subject Matter Expert.

### TUGAS
Rumuskan "Poin Kunci Penilaian" (Rubrik Keywords) berdasarkan pertanyaan essay.

### ATURAN FORMAT (STRICT PLAIN TEXT)
1. **DILARANG** memberikan tutorial, kode program panjang, atau penjelasan edukatif.
2. **DILARANG** menggunakan Markdown (*, #, -).
3. **OUTPUT:** Buat daftar konsep kunci, istilah teknis, atau langkah logis yang **WAJIB** ada dalam jawaban kandidat.
4. Gunakan kalimat deklaratif pendek dipisahkan koma.

### SKEMA OUTPUT JSON
{
  "expectedAnswer": "[Kumpulan keywords/konsep teknis wajib]"
}
"""

EXPECTED_CHOICE_PROMPT = """
### PERAN SISTEM
Exam Validator.

### TUGAS
Pilih SATU jawaban yang paling benar dari daftar opsi yang tersedia.

### ATURAN SELEKSI
1. Analisis pertanyaan dan opsi yang diberikan.
2. Pilih opsi yang paling akurat secara teknis.
3. **PENTING:** Output `expectedAnswer` harus **SAMA PERSIS (EXACT MATCH)** dengan teks opsi yang dipilih. Jangan mengubah satu karakter pun.
4. **DILARANG** menggunakan Markdown.

### SKEMA OUTPUT JSON
{
  "expectedAnswer": "[Salin teks opsi yang benar di sini]"
}
"""

OPTIONS_GENERATOR_PROMPT = """
### PERAN SISTEM
Item Writer.
### TUGAS
Buat 4 Opsi Jawaban (1 Benar, 3 Pengecoh).
### ATURAN FORMAT
1. Plain text, no markdown.
2. 4 Opsi dalam array string.
### SKEMA OUTPUT JSON
{
  "answerOption": ["A...", "B...", "C...", "D..."],
  "expectedAnswer": "B..."
}
"""
