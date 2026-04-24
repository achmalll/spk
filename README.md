# SPK SAW - Class Manager Performance Evaluation

Sistem Pendukung Keputusan (SPK) untuk evaluasi kinerja Class Manager menggunakan metode **Simple Additive Weighting (SAW)**. Aplikasi ini membandingkan hasil perhitungan sistem dengan ranking pakar menggunakan **Korelasi Spearman** untuk menguji akurasi.

## 🚀 Fitur Utama

- **Dashboard Modern**: Visualisasi performa CM dengan podium untuk Top 3.
- **Metode SAW**: Perhitungan otomatis berdasarkan kriteria Achievement, Engagement, Completion, dan Feedback.
- **Analisis Statistik**: Perhitungan Korelasi Spearman dan tingkat akurasi Top 3 untuk validasi hasil.
- **Batch Import**: Import data performa melalui file CSV dengan template yang sudah disediakan.
- **UI Responsif**: Dibangun dengan Tailwind CSS dan React untuk pengalaman pengguna yang mulus.

## 🛠️ Tech Stack

- **Backend**: [Laravel 11](https://laravel.com)
- **Frontend**: [React](https://reactjs.org) dengan [Inertia.js](https://inertiajs.com)
- **Build Tool**: [Vite](https://vitejs.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database**: MySQL / PostgreSQL

## 📋 Kriteria Penilaian

Sistem ini menggunakan 4 kriteria utama dengan bobot tertentu:
1. **Achievement** (C1)
2. **Engagement** (C2)
3. **Completion** (C3)
4. **Feedback** (C4)

## ⚙️ Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/achmalll/spk.git
   cd spk
   ```

2. **Instal Dependensi Backend**
   ```bash
   composer install
   ```

3. **Instal Dependensi Frontend**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Sesuaikan pengaturan database di file `.env`.*

5. **Migrasi & Seed Database**
   ```bash
   php artisan migrate --seed
   ```

6. **Jalankan Aplikasi**
   - Jalankan Server Laravel:
     ```bash
     php artisan serve
     ```
   - Jalankan Vite Dev Server:
     ```bash
     npm run dev
     ```

## 📊 Cara Penggunaan

1. Buka dashboard aplikasi di browser.
2. Download **Template CSV** yang tersedia di dashboard.
3. Isi data performa CM (Nama, Batch, dan Skor Kriteria) serta Ranking Pakar sebagai pembanding.
4. Upload kembali file CSV melalui tombol **Import**.
5. Sistem akan otomatis menghitung ranking menggunakan metode SAW dan menampilkan hasil korelasi statistiknya.

## 📄 Lisensi

Proyek ini bersifat open-source di bawah lisensi [MIT](LICENSE).
