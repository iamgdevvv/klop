![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Style-TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
[![Code of Conduct](https://img.shields.io/badge/Contributor-Covenant-ff69b4.svg)](CODE_OF_CONDUCT.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

![Preview Template](public/images/preview-klop.png)

# Klop! — Smart Recruitment Platform for UMKM & Candidates

Selamat datang di repository **Klop!** 🎉  
Klop! adalah platform rekrutmen berbasis AI yang membantu **UMKM** melakukan proses hiring secara cepat, efisien, dan terstruktur. Aplikasi ini memudahkan perusahaan membuat lowongan, memberikan assessment otomatis, serta menilai kandidat menggunakan bantuan AI. Kandidat pun dapat melamar pekerjaan, mengerjakan assessment anti-cheat, dan menerima feedback secara instan.

---

## 🚀 Fitur Utama

### Untuk Company (UMKM)

- Membuat profil perusahaan dan lowongan (vacancy).
- Membuat assessment berbasis AI untuk setiap vacancy.
- Assign assessment ke kandidat yang sudah diseleksi.
- Penilaian otomatis oleh AI lengkap dengan skor & ringkasan hasil.
- Melihat riwayat submission vacancy dan assessment.
- Halaman publik untuk company & vacancy yang dapat dibagikan secara manual.

### Untuk Kandidat

- Apply vacancy dari berbagai perusahaan.
- Mengerjakan assessment dengan sistem anti-cheat (fullscreen & single-tab).
- Assessment hanya bisa dikerjakan sekali.
- Mendapatkan skor dan summary AI secara langsung setelah selesai.
- Update data diri di halaman Account Settings.
- Melihat riwayat lamaran dan assessment di dashboard pribadi.

---

## 🛠️ Cara Menjalankan Project

Pastikan Anda sudah menginstal **Node.js** versi terbaru.
Salin .env.example ke .env dan konfigurasi:

```env
# Payload
DATABASE_URI=postgresql://klop:123456@localhost:5432/portopro
CRON_SECRET=secret
PAYLOAD_SECRET=secret
PAYLOAD_PREVIEW_SECRET=secret
REVALIDATE_SECRET=secret

# Global
NEXT_PUBLIC_SITE_URL='http://localhost:3000'
NEXT_PUBLIC_SITE_INDEX=false
KLOP_AI_API='https://example.com'
KLOP_AI_TOKEN=secret

# Supabase
SUPABASE_S3_BUCKET=bucket
SUPABASE_S3_ACCESS_KEY_ID=secret
SUPABASE_S3_SECRET_ACCESS_KEY=secret
SUPABASE_S3_REGION=secret
SUPABASE_S3_ENDPOINT=secret
```

1. **Install dependencies**

    ```bash
    npm install
    ```

2. **Build project**

    ```bash
    npm run build
    ```

3. **Jalankan aplikasi**
    ```bash
    npm run start # production
    npm run dev # development
    ```

Aplikasi akan berjalan pada port yang dikonfigurasi oleh Next.js (biasanya http://localhost:3000).

---

## 📖 Lisensi

Proyek ini dirilis di bawah Apache License 2.0 dengan Atribusi Wajib.

Anda boleh:

- Menggunakan, memodifikasi, dan mendistribusikan project ini.

Dengan syarat:

- Wajib mencantumkan atribusi kepada Creators Klop! Contoh:
    - “Proyek ini dibuat dengan X — Creators Klop!”
    - Menyertakan tautan ke repository atau website Creators Klop!
- Atribusi tidak boleh dihapus.

Baca detail lengkap di: [LICENSE.md](./LICENSE.md) dan [NOTICE.md](./NOTICE.md)
