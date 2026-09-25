-- ============================================================
-- SKRIP DATABASE LENGKAP: KLINIKAL HIPERTENSI
-- Standar Kompatibilitas: MySQL / MariaDB / SQLite
-- Deskripsi: Skema DDL dan data awal (Seeder) untuk sistem
-- prediksi dan manajemen rekam medis hipertensi.
-- ============================================================

-- Nonaktifkan pengecekan foreign key sementara saat setup
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. TABEL: users (Akun Tenaga Medis / Dokter)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `email` VARCHAR(255) NULL UNIQUE,
    `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `specialty` VARCHAR(255) NULL DEFAULT 'Dokter Umum',
    `hospital` VARCHAR(255) NULL DEFAULT 'Puskesmas',
    `avatar_url` TEXT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. TABEL: patients (Master Data Registri Pasien)
-- Catatan: Mendukung fitur Edit Pasien (nama, usia, gender,
-- telepon, email, alamat domisili, status tensi, tren tensi).
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
    `id` VARCHAR(50) NOT NULL, -- Contoh: 'PT-2023-001'
    `name` VARCHAR(255) NOT NULL,
    `age` INT NOT NULL,
    `gender` ENUM('L', 'P') NOT NULL,
    `phone` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NULL,
    `status` VARCHAR(50) NOT NULL, -- 'Normal', 'Pra Hipertensi', 'Tingkat 1', 'Tingkat 2', 'Krisis Hipertensi'
    `last_checked` VARCHAR(50) NULL,
    `bp_history` LONGTEXT NULL, -- JSON format: [{"date":"Mei","systolic":120,"diastolic":80}, ...]
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_patient_name` (`name`),
    INDEX `idx_patient_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. TABEL: predictions (Transaksi Riwayat Pemeriksaan Medis)
-- Catatan: Menyimpan variabel klinis lengkap untuk skripsi
-- (BB, TB, IMT, Sistolik, Diastolik, Hasil JNC 7, Confidence Score).
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `predictions`;
CREATE TABLE `predictions` (
    `id` VARCHAR(50) NOT NULL, -- Contoh: 'PAS-001'
    `patient_id` VARCHAR(50) NOT NULL,
    `patient_name` VARCHAR(255) NOT NULL,
    `date` VARCHAR(100) NOT NULL, -- Format teks lokal: '12 Okt 2023, 10:30 WIB'
    `model_used` VARCHAR(100) NOT NULL DEFAULT 'Decision Tree & Random Forest',
    `confidence_score` INT NOT NULL, -- Persentase kepercayaan (0 - 100)
    `accuracy_dt` INT NULL, -- Akurasi sub-model Decision Tree
    `accuracy_rf` INT NULL, -- Akurasi sub-model Random Forest
    `systolic` INT NOT NULL, -- Tekanan Darah Sistolik (mmHg)
    `diastolic` INT NOT NULL, -- Tekanan Darah Diastolik (mmHg)
    `age` INT NOT NULL, -- Usia saat pemeriksaan
    `gender` ENUM('L', 'P') NOT NULL,
    `weight` DOUBLE(8, 2) NOT NULL, -- Berat Badan (kg)
    `height` DOUBLE(8, 2) NOT NULL, -- Tinggi Badan (cm)
    `bmi` DOUBLE(8, 2) NOT NULL, -- Indeks Massa Tubuh (kg/m2)
    `result` VARCHAR(50) NOT NULL, -- Klasifikasi JNC 7 ('Normal', 'Pra Hipertensi', 'Tingkat 1', 'Tingkat 2')
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_pred_patient_id` (`patient_id`),
    INDEX `idx_pred_result` (`result`),
    CONSTRAINT `fk_predictions_patient` 
        FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. TABEL: notifications (Log Aktivitas & Notifikasi Sistem)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `desc` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'danger'
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_notif_user` (`user_id`),
    CONSTRAINT `fk_notifications_user` 
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. TABEL: model_configs (Konfigurasi Parameter Machine Learning)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `model_configs`;
CREATE TABLE `model_configs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `active_model` VARCHAR(100) NOT NULL DEFAULT 'Decision Tree & Random Forest',
    `rf_trees` INT NOT NULL DEFAULT 100,
    `rf_max_depth` INT NOT NULL DEFAULT 12,
    `dt_min_samples` INT NOT NULL DEFAULT 4,
    `lr_iterations` INT NOT NULL DEFAULT 200,
    `confidence_factor` DOUBLE(5, 2) NOT NULL DEFAULT 0.98,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. TABEL: personal_access_tokens (Autentikasi Token Laravel Sanctum)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL UNIQUE,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP NULL DEFAULT NULL,
    `expires_at` TIMESTAMP NULL DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_tokenable` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. TABEL SISTEM STANDAR LARAVEL (Sessions, Tokens)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
    `id` VARCHAR(255) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `payload` LONGTEXT NOT NULL,
    `last_activity` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_sessions_user_id` (`user_id`),
    INDEX `idx_sessions_last_activity` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DATA AWAL (SEEDER DATA)
-- ============================================================

-- 1. Akun Default Dokter / Penguji
-- Password default: arfwjn
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `specialty`, `hospital`, `avatar_url`) VALUES
(1, 'Dr. Arief Sidik', 'arfwjn', 'arief.sidik@klinik.id', '$2y$12$NqLp5mQJkZ5pQ5qQ1Q2Q3eO4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ', 'Cardiologist', 'Puskesmas Percontohan', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80');

-- 2. Master Registri Pasien Awal
INSERT INTO `patients` (`id`, `name`, `age`, `gender`, `phone`, `email`, `address`, `status`, `last_checked`, `bp_history`) VALUES
('PT-2023-001', 'Ahmad Hidayat', 54, 'L', '0812-3456-7890', 'ahmad.hidayat@gmail.com', 'Jl. Sudirman No. 45, Jakarta Selatan', 'Tingkat 2', '2023-10-12', '[{"date":"Jan","systolic":135,"diastolic":85},{"date":"Feb","systolic":140,"diastolic":88},{"date":"Mar","systolic":138,"diastolic":86},{"date":"Apr","systolic":145,"diastolic":92},{"date":"May","systolic":148,"diastolic":94},{"date":"Jun","systolic":152,"diastolic":96},{"date":"Jul","systolic":162,"diastolic":102}]'),
('PT-2023-002', 'Siti Aminah', 42, 'P', '0857-9876-5432', 'siti.aminah@yahoo.com', 'Jl. Merdeka No. 12, Bandung', 'Tingkat 1', '2023-10-10', '[{"date":"Jan","systolic":122,"diastolic":78},{"date":"Feb","systolic":125,"diastolic":80},{"date":"Mar","systolic":124,"diastolic":79},{"date":"Apr","systolic":130,"diastolic":84},{"date":"May","systolic":134,"diastolic":86},{"date":"Jun","systolic":138,"diastolic":89},{"date":"Jul","systolic":142,"diastolic":91}]'),
('PT-2023-003', 'Budi Santoso', 35, 'L', '0821-4433-2211', 'budi.santoso@outlook.com', 'Jl. Diponegoro No. 89, Surabaya', 'Normal', '2023-10-05', '[{"date":"Jan","systolic":115,"diastolic":75},{"date":"Feb","systolic":118,"diastolic":76},{"date":"Mar","systolic":120,"diastolic":77},{"date":"Apr","systolic":117,"diastolic":75},{"date":"May","systolic":116,"diastolic":74},{"date":"Jun","systolic":118,"diastolic":76},{"date":"Jul","systolic":119,"diastolic":77}]'),
('PT-2023-004', 'Hendro Siswanto', 48, 'L', '0813-8899-7766', 'hendro.s@gmail.com', 'Jl. Pahlawan No. 22, Semarang', 'Pra Hipertensi', '2023-10-15', '[{"date":"Jan","systolic":124,"diastolic":80},{"date":"Feb","systolic":126,"diastolic":81},{"date":"Mar","systolic":128,"diastolic":82},{"date":"Apr","systolic":130,"diastolic":83},{"date":"May","systolic":132,"diastolic":84},{"date":"Jun","systolic":130,"diastolic":82},{"date":"Jul","systolic":135,"diastolic":85}]'),
('PT-2023-005', 'Ratna Sari', 29, 'P', '0819-2233-4455', 'ratna.sari@gmail.com', 'Jl. Gajah Mada No. 10, Yogyakarta', 'Normal', '2023-10-01', '[{"date":"Jan","systolic":110,"diastolic":70},{"date":"Feb","systolic":112,"diastolic":72},{"date":"Mar","systolic":114,"diastolic":72},{"date":"Apr","systolic":115,"diastolic":74},{"date":"May","systolic":112,"diastolic":70},{"date":"Jun","systolic":114,"diastolic":72},{"date":"Jul","systolic":116,"diastolic":75}]');

-- 3. Transaksi Riwayat Pemeriksaan Medis Awal
INSERT INTO `predictions` (`id`, `patient_id`, `patient_name`, `date`, `model_used`, `confidence_score`, `accuracy_dt`, `accuracy_rf`, `systolic`, `diastolic`, `age`, `gender`, `weight`, `height`, `bmi`, `result`) VALUES
('PAS-001', 'PT-2023-001', 'Ahmad Hidayat', '12 Okt 2023, 10:30 WIB', 'Decision Tree & Random Forest', 97, 95, 98, 162, 102, 54, 'L', 78.5, 168.0, 27.8, 'Tingkat 2'),
('PAS-002', 'PT-2023-002', 'Siti Aminah', '10 Okt 2023, 14:15 WIB', 'Decision Tree & Random Forest', 91, 89, 93, 142, 91, 42, 'P', 65.0, 155.0, 27.1, 'Tingkat 1'),
('PAS-003', 'PT-2023-003', 'Budi Santoso', '05 Okt 2023, 09:00 WIB', 'Decision Tree & Random Forest', 58, 56, 60, 119, 77, 35, 'L', 68.0, 172.0, 23.0, 'Normal'),
('PAS-004', 'PT-2023-004', 'Hendro Siswanto', '15 Okt 2023, 11:20 WIB', 'Decision Tree & Random Forest', 74, 72, 76, 135, 85, 48, 'L', 74.0, 165.0, 27.2, 'Pra Hipertensi'),
('PAS-005', 'PT-2023-005', 'Ratna Sari', '01 Okt 2023, 08:45 WIB', 'Decision Tree & Random Forest', 55, 54, 57, 116, 75, 29, 'P', 52.0, 158.0, 20.8, 'Normal');

-- 4. Konfigurasi Model Default
INSERT INTO `model_configs` (`id`, `active_model`, `rf_trees`, `rf_max_depth`, `dt_min_samples`, `lr_iterations`, `confidence_factor`) VALUES
(1, 'Decision Tree & Random Forest', 100, 12, 4, 200, 0.98);

-- 5. Notifikasi Sistem Awal
INSERT INTO `notifications` (`id`, `user_id`, `title`, `desc`, `type`, `is_read`) VALUES
(1, 1, 'Inisialisasi Sistem Selesai', 'Sistem prediksi dan registri klinis hipertensi berhasil disiapkan.', 'success', 1),
(2, 1, 'Peringatan Tekanan Darah', 'Pasien Ahmad Hidayat terdeteksi mengalami Hipertensi Tingkat 2 (162/102 mmHg).', 'danger', 0);
