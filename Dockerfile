# Gunakan base image Python yang ringan
FROM python:3.11-slim

# Set environment variables
# PYTHONDONTWRITEBYTECODE: Mencegah Python membuat file .pyc
# PYTHONUNBUFFERED: Memastikan log langsung muncul di console
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory di dalam container
WORKDIR /app

# Install dependencies sistem yang mungkin dibutuhkan (opsional tapi disarankan)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Salin file requirements terlebih dahulu (untuk caching layer docker)
COPY requirements.txt .

# Install dependencies Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Buat user non-root untuk keamanan (Best Practice)
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# Expose port (sesuaikan dengan port aplikasi Anda, misal 8000)
EXPOSE 8000

# Perintah untuk menjalankan aplikasi
# Ganti 'app.main:app' sesuai lokasi file utama Anda.
# Misal jika file utama ada di folder app/main.py dan instance FastAPI bernama 'app'
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
