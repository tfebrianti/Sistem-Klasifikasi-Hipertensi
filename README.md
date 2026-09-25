# 🏥 Sistem Klasifikasi & Prediksi Tingkat Hipertensi Berbasis Machine Learning
### Clinical Decision Support System (CDSS) — Puskesmas Kembaran 1

Aplikasi web pendukung keputusan klinis (*Clinical Decision Support System*) untuk klasifikasi tingkat hipertensi pasien berdasarkan standar **JNC 7** menggunakan algoritma **Machine Learning (Ensemble Decision Tree & Random Forest)**. Dibangun dengan integrasi **React (Vite) + Laravel 11 (REST API) + Python ML Engine**.

---

## 📑 Daftar Isi
1. [Fitur Utama Sistem](#-fitur-utama-sistem)
2. [Arsitektur & Teknologi](#-arsitektur--teknologi)
3. [Kebutuhan Perangkat Lunak (Prerequisites)](#-kebutuhan-perangkat-lunak-prerequisites)
4. [Panduan Instalasi Lengkap untuk Pemula (Step-by-Step)](#-panduan-instalasi-lengkap-untuk-pemula-step-by-step)
   - [Langkah 1: Menyiapkan Database MySQL di XAMPP](#langkah-1-menyiapkan-database-mysql-di-xampp)
   - [Langkah 2: Menyiapkan Backend Laravel](#langkah-2-menyiapkan-backend-laravel)
   - [Langkah 3: Menyiapkan Lingkungan Machine Learning Python](#langkah-3-menyiapkan-lingkungan-machine-learning-python)
   - [Langkah 4: Menyiapkan dan Menjalankan Frontend React](#langkah-4-menyiapkan-dan-menjalankan-frontend-react)
   - [Langkah 5: Akun Login Bawaan](#langkah-5-akun-login-bawaan-default-credentials)
5. [Struktur Bagian Prediksi & Panduan Mengganti Model Baru](#-struktur-bagian-prediksi--panduan-mengganti-model-baru)
   - [Alur Kerja Prediksi](#alur-kerja-prediksi)
   - [Peta Berkas Komponen Prediksi](#peta-berkas-komponen-prediksi)
   - [Cara Mengganti Model dengan Model Baru](#cara-mengganti-model-dengan-model-baru)
6. [Troubleshooting (Solusi Masalah Umum)](#-troubleshooting-solusi-masalah-umum)

---

## 🌟 Fitur Utama Sistem

- **Klasifikasi Tingkat Hipertensi JNC 7**:
  Mengklasifikasikan kondisi tekanan darah ke dalam 4 kategori klinis: *Normal*, *Pra Hipertensi*, *Tingkat 1*, dan *Tingkat 2*.
- **Confidence Score Dinamis**:
  Menghitung persentase keyakinan model secara presisi berbasis probabilitas ensemble (*weighted probability*).
- **Deteksi Peringatan Tekanan Nadi (*Pulse Pressure Alert*)**:
  Menghitung selisih sistolik dan diastolik ($SYS - DIA$). Menampilkan peringatan klinis khusus secara otomatis jika tekanan nadi $\ge 60\text{ mmHg}$ (indikasi kekakuan arteri/risiko kardiovaskular).
- **Integrasi Cerdas Data Pasien Terdaftar**:
  Memilih pasien terdaftar akan otomatis mengisi demografi (usia, jenis kelamin) dan riwayat data pemeriksaan terakhir (berat badan, tinggi badan, sistolik, diastolik) untuk mempercepat proses entri tenaga medis.
- **Visualisasi Tren Fluktuasi Tekanan Darah**:
  Grafik interaktif kurva sistolik vs diastolik pasien dengan tooltip pintar yang tidak terpotong batas layar.
- **Manajemen Pasien & Riwayat Medis**:
  Pencatatan rekam medis lengkap, pagination data per 5 entri, fitur edit informasi pasien, serta pencarian instan.
- **Audit Log Notifikasi**:
  Pencatatan riwayat diagnosis baru, pembaruan profil, dan aktivitas faskes secara real-time.
- **Mekanisme Graceful Fallback**:
  Jika lingkungan Python mengalami kendala, backend secara otomatis beralih ke aturan deterministik JNC 7 tanpa memutus alur kerja nakes di puskesmas.

---

## 🏗 Arsitektur & Teknologi

```
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (React 18 + Vite)                  │
│       Tailwind CSS • Lucide Icons • Motion • Zustand        │
│                    Port: http://localhost:3000              │
└──────────────────────────────┬──────────────────────────────┘
                               │  HTTP / REST API (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Laravel 11 REST API)               │
│               Sanctum Auth • MySQL Eloquent ORM             │
│                   Port: http://127.0.0.1:8000               │
└──────────────────────────────┬──────────────────────────────┘
                               │  Process CLI Bridge (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              PYTHON ML INFERENCE ENGINE (ml_engine)         │
│     StandardScaler • Decision Tree • Random Forest (.pkl)   │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Motion, Zustand, Lucide React.
- **Backend**: Laravel 11, PHP 8.2+, MySQL, Laravel Sanctum Token Authentication.
- **Machine Learning**: Python 3.10+, Scikit-Learn 1.9+, Imbalanced-Learn (SMOTE), Joblib, Pandas, NumPy.

---

## 💻 Kebutuhan Perangkat Lunak (Prerequisites)

Sebelum mulai, pastikan perangkat komputer/laptop Anda telah terpasang aplikasi-aplikasi berikut. Jika belum punya, unduh melalui tautan resmi yang telah disediakan:

1. **XAMPP (Versi 8.2 ke atas)**  
   *Fungsi*: Menyediakan server web lokal Apache dan database MySQL.  
   *Unduh*: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
2. **Composer**  
   *Fungsi*: Pengelola dependensi pustaka untuk bahasa pemrograman PHP (Laravel).  
   *Unduh*: [https://getcomposer.org/Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe)
3. **Node.js (Versi 18 LTS atau 20 LTS)**  
   *Fungsi*: Menjalankan runtime JavaScript dan pengelola paket `npm` untuk antarmuka web.  
   *Unduh*: [https://nodejs.org/](https://nodejs.org/)
4. **Python (Versi 3.10, 3.11, atau 3.12/3.14)**  
   *Fungsi*: Menjalankan model machine learning (.pkl) untuk inferensi klasifikasi.  
   *Unduh*: [https://www.python.org/downloads/](https://www.python.org/downloads/)  
   > ⚠️ **PENTING SAAT INSTALL PYTHON**: Pada jendela pertama instalasi Python, centang kotak **"Add python.exe to PATH"** agar Python dapat dipanggil dari mana saja.
5. **Web Browser Modern** (Google Chrome, Microsoft Edge, atau Mozilla Firefox).
6. **Visual Studio Code** (Direkomendasikan untuk membuka kode): [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## 🚀 Panduan Instalasi Lengkap untuk Pemula (Step-by-Step)

Ikuti langkah-langkah berikut secara berurutan. Panduan ini dirancang agar mudah diikuti bahkan jika Anda belum pernah menulis kode sebelumnya.

---

### Langkah 1: Menyiapkan Database MySQL di XAMPP

1. Buka aplikasi **XAMPP Control Panel**.
2. Pada baris **Apache**, klik tombol **Start**.
3. Pada baris **MySQL**, klik tombol **Start**.  
   *(Pastikan kedua modul berubah warna menjadi hijau, menandakan server telah aktif).*
4. Buka peramban (browser) Anda, lalu kunjungi alamat:  
   👉 **`http://localhost/phpmyadmin`**
5. Pada panel menu sebelah kiri atau tab atas, klik **"New"** (atau **"Baru"**).
6. Pada kolom *Database name*, ketik persis:  
   `hipertensi`
7. Pilih collation: `utf8mb4_unicode_ci` (atau biarkan default), lalu klik tombol **Create** (Buat).
8. Database kosong bernama `hipertensi` kini telah siap.

---

### Langkah 2: Menyiapkan Backend Laravel

1. Buka **Command Prompt (CMD)** atau **PowerShell**.
2. Masuk ke folder backend proyek ini:
   ```bash
   cd backend
   ```
   *(Atau arahkan terminal ke folder `backend` di dalam direktori proyek Anda).*

3. Salin berkas konfigurasi lingkungan:
   - Jika menggunakan **Command Prompt / Windows CMD**:
     ```cmd
     copy .env.example .env
     ```
   - Jika menggunakan **PowerShell**:
     ```powershell
     Copy-Item .env.example .env
     ```

4. Periksa isi file `.env` di dalam folder `backend`:
   Pastikan bagian konfigurasi database sudah tertulis seperti ini:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hipertensi
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Biarkan `DB_PASSWORD=` kosong karena instalasi default XAMPP tidak memiliki password).*

5. Pasang dependensi pustaka PHP:
   ```bash
   composer install
   ```

6. Buat kunci keamanan aplikasi Laravel:
   ```bash
   php artisan key:generate
   ```

7. Jalankan migrasi tabel database dan masukkan data awal (*seeding*):
   ```bash
   php artisan migrate --seed
   ```
   *Perintah ini akan secara otomatis membuat seluruh tabel database (`users`, `patients`, `predictions`, `model_configs`, `notifications`) beserta data awal pasien dan dokter.*

8. Jalankan server backend:
   ```bash
   php artisan serve --port=8000
   ```
   *Jika berhasil, akan muncul pesan: `Server running on [http://127.0.0.1:8000]`.*  
   > 🔔 **PENTING**: Biarkan jendela terminal ini tetap terbuka dan berjalan di latar belakang selama aplikasi digunakan.

---

### Langkah 3: Menyiapkan Lingkungan Machine Learning Python

1. Buka jendela **Command Prompt (CMD) atau PowerShell baru** (jangan tutup terminal backend).
2. Pastikan Python sudah terdeteksi di komputer Anda dengan mengetik:
   ```bash
   python --version
   ```
3. Pasang semua pustaka machine learning yang diperlukan:
   ```bash
   python -m pip install scikit-learn joblib pandas numpy imbalanced-learn
   ```
4. **Model Machine Learning Siap Pakai**:
   Model machine learning (`scaler_hipertensi.pkl`, `model_decision_tree_clinical.pkl`, `model_random_forest_clinical.pkl`) sudah disediakan siap pakai di dalam folder `backend/ml_engine/models/`. Model ini dihasilkan secara *offline* dari proses eksperimen di Jupyter Notebook (`Skripsi_Hipertensi_Triana.ipynb`). Anda tidak perlu melakukan proses *training* ulang untuk menjalankan aplikasi web.

5. **Uji inferensi model Python secara langsung**:
   Masuk ke folder `backend/ml_engine` lalu jalankan skrip inferensi:
   ```bash
   cd backend/ml_engine
   python predict.py --usia 45 --gender L --berat 70 --tinggi 165 --sistolik 140 --diastolik 90
   ```
   *Jika berhasil, Anda akan melihat keluaran JSON dengan hasil `"result": "Tingkat 1"` dan skor keyakinan persentase.*

---

### Langkah 4: Menyiapkan dan Menjalankan Frontend React

1. Buka jendela **Command Prompt (CMD) atau PowerShell baru lagi**.
2. Masuk ke folder root utama proyek (tempat file `package.json` berada):
   ```bash
   cd ..
   # Atau jika dari terminal baru, arahkan langsung ke folder root proyek
   ```
3. Pasang dependensi JavaScript:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan antarmuka (Vite):
   ```bash
   npm run dev
   ```
5. Buka peramban (browser) dan akses alamat:  
   👉 **`http://localhost:3000`**

---

### Langkah 5: Akun Login Bawaan (Default Credentials)

> 💡 Anda dapat mendaftarkan akun baru tenaga medis lainnya melalui tombol **"Daftar Akun Baru"** pada halaman login.

---

## 🔬 Struktur Bagian Prediksi & Panduan Mengganti Model Baru

Bagian ini merupakan panduan teknis khusus bagi pengembang, peneliti, atau mahasiswa yang ingin **mengganti model machine learning dengan model terbaru di masa mendatang**.

### Alur Kerja Prediksi

```
1. Frontend (Formulir Klinis)
   User menginput: Usia, Gender, Berat, Tinggi, Sistolik, Diastolik
   └─ Mengirim HTTP POST /api/classify ke Laravel
         │
         ▼
2. Backend (PredictionController.php)
   - Memvalidasi rentang biologis parameter klinis
   - Menghitung IMT = Berat / (Tinggi/100)^2
   - Memanggil Python CLI Engine (Symfony Process)
         │
         ▼
3. Python ML Engine (backend/ml_engine/predict.py)
   - Melakukan feature encoding (JK_Code, Kategori_Usia_Code)
   - Menyusun feature vector: [Umur, JK_Code, Kategori_Usia_Code, BB, TB, IMT, SYS, DIA]
   - Melakukan scaling dengan scaler_hipertensi.pkl
   - Melakukan inferensi:
       • Decision Tree (model_decision_tree_clinical.pkl)
       • Random Forest (model_random_forest_clinical.pkl)
   - Menghitung Weighted Ensemble Probabilities (60% RF + 40% DT)
   - Menghitung Pulse Pressure = SYS - DIA
   - Menghasilkan output JSON terstandar ke stdout
         │
         ▼
4. Backend (PredictionController.php)
   - Menangkap output JSON dari Python
   - Menyimpan rekam diagnosis ke tabel 'predictions'
   - Mengupdate status & histori tekanan darah pasien pada tabel 'patients'
   - Mencatat log audit notifikasi
   - Mengembalikan HTTP Response 201 ke Frontend
         │
         ▼
5. Frontend (PredictionResult.tsx)
   - Menampilkan Kategori Hipertensi (Normal, Pra Hipertensi, Tingkat 1, Tingkat 2)
   - Menampilkan Skor Kepercayaan (Confidence Score %)
   - Menampilkan Peringatan Tekanan Nadi jika PP >= 60 mmHg
```

---

### Peta Berkas Komponen Prediksi

Berikut berkas-berkas penting yang menyusun sistem klasifikasi:

```
Klinikal Hipertensi/
├── backend/
│   ├── ml_engine/
│   │   ├── models/                                      <-- [A] TEMPAT FILE BINARY MODEL
│   │   │   ├── scaler_hipertensi.pkl                    <-- Objek StandardScaler (dari Skripsi_Hipertensi_Triana.ipynb)
│   │   │   ├── model_decision_tree_clinical.pkl         <-- Model Decision Tree (dari Skripsi_Hipertensi_Triana.ipynb)
│   │   │   ├── model_random_forest_clinical.pkl         <-- Model Random Forest (dari Skripsi_Hipertensi_Triana.ipynb)
│   │   │   └── model_metadata.json                      <-- Catatan metrik & parameter skenario
│   │   └── predict.py                                   <-- [B] JEMBATAN INFERENSI PYTHON (Inference Engine)
│   │
│   └── app/Http/Controllers/
│       └── PredictionController.php                     <-- [C] KONTROLER LARAVEL
│
└── src/
    ├── features/prediction/
    │   ├── components/
    │   │   ├── ClinicalForm.tsx                         <-- Formulir entri klinis
    │   │   ├── PredictionResult.tsx                     <-- Kartu visualisasi hasil
    │   │   └── StageIndicator.tsx                       <-- Indikator tingkat keparahan
    │   └── hooks/
    │       └── usePrediction.ts                         <-- Hook state formulir
    └── services/
        └── predictionService.ts                         <-- Pemanggil API Axios
```

---

### Cara Mengganti Model dengan Model Baru

Jika di masa mendatang Anda memiliki model baru hasil pelatihan eksperimen (misalnya: model dengan algoritma baru seperti XGBoost/LightGBM, atau model yang dilatih dengan dataset yang lebih mutakhir), ikuti panduan berikut:

#### Skenario 1: Mengganti File Model Saja (Fitur & Algoritma Sama)
Jika model baru Anda tetap menggunakan 8 fitur yang sama (`Umur`, `JK_Code`, `Kategori_Usia_Code`, `Berat Badan`, `Tinggi Badan`, `IMT`, `Sistole`, `Diastole`):

1. Latih model di Jupyter Notebook / Google Colab Anda.
2. Simpan model dan scalernya menggunakan `joblib`:
   ```python
   import joblib

   joblib.dump(scaler, 'scaler_hipertensi.pkl')
   joblib.dump(dt_model, 'model_decision_tree_clinical.pkl')
   joblib.dump(rf_model, 'model_random_forest_clinical.pkl')
```
3. Salin dan timpa ketiga berkas `.pkl` tersebut ke folder:  
   📁 `backend/ml_engine/models/`
4. Perbarui file `backend/ml_engine/models/model_metadata.json` jika ingin memperbarui catatan nilai akurasi evaluasi model Anda.
5. **Selesai!** Sistem web akan langsung menggunakan model baru tersebut tanpa perlu restart server.

---

#### Skenario 2: Mengganti Algoritma Model (Contoh: Menjadi XGBoost / SVM)
Jika Anda beralih dari Decision Tree / Random Forest ke algoritma lain:

1. Letakkan berkas model baru (misal `model_xgboost_clinical.pkl`) di `backend/ml_engine/models/`.
2. Buka berkas `backend/ml_engine/predict.py`:
   - Pada fungsi `get_models()` (baris 42–76), ubah pemanggilan `joblib.load()` untuk memuat file model baru Anda:
     ```python
     # Contoh jika mengganti model
     xgb_path = os.path.join(models_dir, 'model_xgboost_clinical.pkl')
     xgb_model = joblib.load(xgb_path)
```
   - Pada fungsi `predict()` (baris 78–168), sesuaikan pemanggilan `model.predict()` dan `model.predict_proba()` dengan model baru Anda.
3. Jika model baru membutuhkan pustaka tambahan (misal `xgboost`), pasang di lingkungan Python:
   ```bash
   python -m pip install xgboost
   ```
4. **Selesai!** Backend Laravel tidak perlu diubah karena berkomunikasi melalui protokol antarmuka JSON yang sama.

---

#### Skenario 3: Menambah / Mengubah Fitur Klinis Input (Misal: Menambah Gula Darah / Kolesterol)
Jika model baru Anda membutuhkan fitur input tambahan selain 8 fitur standar:

1. **Di Model Python (`backend/ml_engine/predict.py`)**:
   - Tambahkan argumen CLI baru pada fungsi `main()` (misal `--gula-darah`).
   - Tambahkan kolom baru ke dalam `feature_cols` pada urutan yang **PERSIS SAMA** dengan saat model dilatih:
     ```python
     feature_cols = [
         'Umur',
         'JK_Code',
         'Kategori_Usia_Code',
         'Berat Badan (kg)',
         'Tinggi Badan (cm)',
         'IMT',
         'Sistole',
         'Diastole',
         'Gula_Darah',  # <- Fitur baru
     ]
```
2. **Di Backend Laravel (`backend/app/Http/Controllers/PredictionController.php`)**:
   - Tambahkan aturan validasi baru di method `store()`:
     ```php
     $validated = $request->validate([
         ...
         'gulaDarah' => 'required|numeric|min:1',
     ]);
     ```
   - Kirimkan argumen tersebut saat memanggil proses Python di `runPythonInference()`.
   - Simpan fitur baru ke tabel `predictions` (buat migrasi kolom baru jika ingin tersimpan permanen di database).
3. **Di Frontend**:
   - Tambahkan field input di `src/features/prediction/components/ClinicalForm.tsx`.
   - Perbarui tipe payload di `src/services/predictionService.ts`.
   - Simpan state input pada `src/features/prediction/hooks/usePrediction.ts`.

---

## 🔧 Troubleshooting (Solusi Masalah Umum)

### 1. Database connection refused / "SQLSTATE[HY000] [2002]"
- **Penyebab**: Modul MySQL di XAMPP belum menyala.
- **Solusi**: Buka XAMPP Control Panel, pastikan tombol **Start** pada **MySQL** sudah diklik dan berstatus hijau.

### 2. "Python tidak dikenali sebagai perintah internal atau eksternal" (Command not found)
- **Penyebab**: Python belum terdaftar di Environment Variables (PATH) Windows.
- **Solusi**:
  1. Buka file `backend/.env`.
  2. Cari baris `PYTHON_BINARY=`.
  3. Masukkan path lengkap file `python.exe` Anda, misalnya:
     ```env
     PYTHON_BINARY=C:\Users\NAMA_USER_ANDA\AppData\Local\Programs\Python\Python311\python.exe
     ```
     *(Atau biarkan `PYTHON_BINARY=python` jika Python sudah terdaftar di PATH).*

### 3. Port 8000 atau Port 3000 sudah terpakai (EADDRINUSE)
- **Solusi**:
  - Untuk backend Laravel: ganti port dengan perintah: `php artisan serve --port=8080`.
  - Untuk frontend React: Vite akan secara otomatis menawarkan port alternatif (misal port `3001`).

### 4. Ekstensi PHP `pdo_mysql` belum aktif
- **Penyebab**: PHP belum mengaktifkan modul koneksi database MySQL.
- **Solusi**: Buka XAMPP Control Panel -> klik tombol **Config** di sebelah Apache -> pilih **PHP (php.ini)** -> cari baris `;extension=pdo_mysql` -> hapus tanda titik koma `;` di depannya -> Simpan file dan restart Apache di XAMPP.

### 5. Seluruh Data Riwayat atau Pasien Terhapus / Ingin Reset Bersih
- Jalankan perintah berikut di terminal backend:
  ```bash
  php artisan migrate:fresh --seed
  ```
  *(Perintah ini akan menyetel ulang semua tabel ke kondisi awal pabrik lengkap dengan data sampel).*

---

## 👨‍💻 Hak Cipta & Pengembang

- **Peneliti / Pengembang**: Triana Febrianti (NIM: 202201044)  
- **Program Studi**: Sistem Informasi, STIKOM Yos Sudarso Purwokerto  
- **Tahun**: 2026  
- **Mitra Studi Kasus**: Puskesmas Kembaran 1, Kabupaten Banyumas
