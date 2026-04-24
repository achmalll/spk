# 📄 PRD FIX: Sistem Evaluasi Performa Class Manager Berbasis Data
**Metode:** SAW (Simple Additive Weighting) | **Tech Stack:** Laravel 11/12, Tailwind 3/4, Shadcn/Chakra

## 1. Pendahuluan & Tujuan
Sistem ini bertujuan untuk menentukan **3 Class Manager terbaik** setiap bulannya secara objektif berdasarkan 4 kriteria utama. 

## 2. Alur Pengguna (User Flow)
1.  **Dashboard:** User mengunduh template CSV yang sudah menyertakan kolom `rank_pakar`.
2.  **Import:** User mengunggah data performa bulanan Class Manager.
3.  **Config:** User memasukkan bobot untuk kriteria C1-C4.
4.  **Process:** Sistem melakukan normalisasi dan perankingan SAW.
5.  **Evaluation:** Sistem menghitung korelasi Spearman untuk menguji akurasi ranking sistem terhadap ranking pakar.

## 3. Arsitektur Teknologi
* **Backend:** Laravel 11 (LTS) atau 12 (Stable).
* **Frontend:** Blade + Livewire atau Inertia.js (React/Vue).
* **UI Components:** Shadcn UI atau Chakra UI (fokus pada performa ringan).
* **Styling:** Tailwind CSS v3 atau v4.

## 4. Database Schema (MySQL)
* **`class_managers`**: `id`, `nama`, `batch`, `is_active`.
* **`criterias`**: `id`, `name`, `weight`, `type` (Benefit).
* **`performance_scores`**: `id`, `manager_id`, `criteria_id`, `value`.
* **`evaluation_results`**: `id`, `manager_id`, `final_score`, `rank_system`, **`rank_pakar`**.

## 5. Implementasi Algoritma SAW (Core Engine)
Kriteria Penilaian:
* **C1 (Achievement)**: Benefit, Bobot dinamis.
* **C2 (Engagement)**: Benefit, Bobot dinamis.
* **C3 (Completion)**: Benefit, Bobot dinamis.
* **C4 (Feedback)**: Benefit, Bobot dinamis.

**Langkah Perhitungan:**
1.  **Normalisasi ($R$):** Karena semua *Benefit*, rumusnya $R_{ij} = x_{ij} / max(x_j)$.
2.  **Skor Akhir ($V$):** $V_i = \sum (W_j \times R_{ij})$.

---

## 6. Modul Evaluasi Kinerja (Tugas 7)
Sistem membandingkan ranking sistem dengan ranking manual manajemen (Pakar).

* **Spearman Rank Correlation ($r_s$):**
    $$r_s = 1 - \frac{6 \sum d^2}{n(n^2 - 1)}$$
    * $d$ = Selisih `rank_system` dan `rank_pakar`.
    * $n$ = Jumlah Class Manager.
* **Akurasi Top-1 & Top-3:** Mengecek kesesuaian "Juara 1" dan daftar "3 Terbaik" antara sistem dan pakar.

---

## 7. Detail Antarmuka & UX
* **Template Download:** CSV dengan header: `rank_pakar, nama, achievement, engagement, completion, feedback`.
* **Podium Visual:** Menampilkan 3 besar dengan visualisasi yang menonjol di dashboard.
* **Evaluation Tab:** Menampilkan tabel selisih ranking, nilai $r_s$, dan status validitas (Sangat Baik jika $r_s \ge 0.7$).

## 8. Fitur Utama
* **Bulk Import:** Impor ratusan data CM dalam hitungan detik.
* **Dynamic Weighting:** Admin bisa mengubah prioritas penilaian tiap bulan.
* **Professional Reporting:** Export hasil 3 terbaik ke dalam format PDF yang rapi.

---

### 📝 Contoh Struktur Kolom CSV
| rank_pakar | nama | achievement | engagement | completion | feedback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Budi | 90 | 85 | 100 | 4.8 |
| 2 | Susi | 85 | 90 | 95 | 4.9 |

### 📝 Instruksi untuk AI Coder
> "Bantu saya membuat **Sistem Evaluasi Performa Class Manager** menggunakan Laravel 11/12 dan Shadcn UI. 
> 1. Gunakan metode **SAW** untuk meranking Class Manager (Kriteria C1-C4, semua tipe Benefit).
> 2. Implementasikan fitur **Import CSV** yang memetakan kolom 'rank_pakar' untuk evaluasi.
> 3. Implementasikan **Tugas 7**: Hitung korelasi **Spearman** antara ranking sistem dan pakar.
> 4. Tampilkan **Podium 3 Terbaik** dan tab 'Evaluasi Akurasi' di dashboard.
> 5. Pastikan UI ringan, menggunakan Tailwind CSS, dan responsif."
