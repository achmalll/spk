# TOPSIS Performance Expert Console

[![Laravel Framework](https://img.shields.io/badge/Laravel-13-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

A professional, high-fidelity Decision Support System (SPK) built with **Laravel 13**, **React 19**, and **Inertia.js v3**. This console implements the **TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)** algorithm to provide objective performance rankings for Class Managers based on multi-criteria analysis.

---

## ✨ Features

- **TOPSIS Engine**: Robust implementation of the 7-step TOPSIS algorithm.
- **Period-Based Analytics**: Isolated data processing per month/year to ensure valid comparisons.
- **Batch Management**: Track performance across different student/program batches.
- **Expert Console UI**: Dark-mode optimized, high-density professional analytics dashboard.
- **Interactive Podium**: Beautifully rendered cards for Top 3 performers.
- **Dynamic Dataset Manager**: Live table with visual performance indicators.
- **Excel Batch Import**: Bulk data entry support with automatic validation.
- **Responsive Layout**: Fluid design that adapts to sidebar states and screen sizes.

---

## 🛠️ Tech Stack

- **Backend**: Laravel 13, PHP 8.3
- **Frontend**: React 19, TypeScript
- **State/Routing**: Inertia.js v3
- **Styling**: Tailwind CSS v4, Lucide Icons, Shadcn UI
- **Database**: SQLite (Default) or MySQL
- **Tooling**: Wayfinder for typed routing, Vite for bundling

---

## 🚀 Installation Guide

Follow these steps to set up the project locally:

### 1. Prerequisite
Ensure you have the following installed:
- PHP 8.3+
- Composer
- Node.js & NPM

### 2. Clone the Repository
```bash
git clone https://github.com/achmalll/spk.git
cd spk
```

### 3. Backend Setup
```bash
composer install
cp .env.example .env
php artisan key:generate
```

### 4. Database Setup
```bash
touch database/database.sqlite
php artisan migrate --seed
```

### 5. Frontend Setup
```bash
npm install
npm run dev
```

---

## 📐 TOPSIS Methodology

The ranking is computed through these steps:
1. **Decision Matrix (R)**: Normalizing inputs from criteria (Achievement, Engagement, Completion, Feedback).
2. **Weighted Matrix (V)**: Applying criteria priority weights.
3. **Ideal Solutions**: Determining Positive Ideal (A+) and Negative Ideal (A-) values.
4. **Euclidean Distance**: Calculating distance to both ideal solutions (D+ and D-).
5. **Preference Score (V)**: Final computation of the closeness coefficient.

---

## 📜 License

This project is open-sourced under the [MIT license](LICENSE).

---

Developed as a Professional Performance Decision Support System. 🏆
