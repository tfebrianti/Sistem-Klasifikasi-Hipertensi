<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model Riwayat Prediksi & Klasifikasi AI (Prediction Model)
 *
 * Menyimpan seluruh catatan inferensi algoritma Decision Tree & Random Forest:
 * data masukan klinis, model yang digunakan, hasil kelas JNC-7, skor probabilitas keyakinan, dan akurasi model.
 *
 * @property string $id Identifier unik catatan prediksi format string (contoh: 'PRD-2023-001')
 * @property string|null $patient_id ID pasien yang terhubung (foreign key ke patients.id)
 * @property string $patient_name Nama pasien pada saat prediksi dilakukan
 * @property string $date Tanggal pencatatan hasil klasifikasi
 * @property string $model_used Nama model/algoritma machine learning yang digunakan
 * @property float $confidence_score Skor probabilitas keyakinan hasil klasifikasi (0-100%)
 * @property int $systolic Tekanan darah sistolik dalam mmHg
 * @property int $diastolic Tekanan darah diastolik dalam mmHg
 * @property int $age Usia pasien dalam tahun
 * @property string $gender Jenis kelamin ('L' / 'P')
 * @property float $weight Berat badan dalam kilogram
 * @property float $height Tinggi badan dalam sentimeter
 * @property float $bmi Indeks Massa Tubuh (IMT / BMI)
 * @property string $result Hasil klasifikasi (Normal, Pra Hipertensi, Tingkat 1, Tingkat 2)
 * @property float|null $accuracy_dt Akurasi evaluasi model Decision Tree (%)
 * @property float|null $accuracy_rf Akurasi evaluasi model Random Forest (%)
 */
class Prediction extends Model
{
    use HasFactory;

    /**
     * Primary key berupa string kode unik.
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Kolom-kolom yang dapat diisi secara massal (mass assignable).
     */
    protected $fillable = [
        'id',
        'patient_id',
        'patient_name',
        'date',
        'model_used',
        'confidence_score',
        'systolic',
        'diastolic',
        'age',
        'gender',
        'weight',
        'height',
        'bmi',
        'result',
        'accuracy_dt',
        'accuracy_rf',
    ];

    /**
     * Relasi Many-to-One: Prediksi ini dimiliki oleh seorang Pasien terdaftar.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }
}
