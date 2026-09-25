<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model Data Pasien (Patient Model)
 *
 * Merepresentasikan entitas rekam medis pasien di Puskesmas Kembaran 1.
 *
 * @property string $id Identifier unik pasien format string (contoh: 'PT-2023-001')
 * @property string $name Nama lengkap pasien
 * @property int $age Usia pasien dalam tahun
 * @property string $gender Jenis kelamin ('L' / 'P')
 * @property string|null $phone Nomor telepon / kontak pasien
 * @property string|null $email Alamat email pasien
 * @property string|null $address Alamat tempat tinggal pasien
 * @property string $status Kategori hipertensi terkini (Normal, Pra Hipertensi, Tingkat 1, Tingkat 2)
 * @property string $last_checked Tanggal terakhir pemeriksaan klinis
 * @property array $bp_history Array riwayat pengukuran tekanan darah berkala
 */
class Patient extends Model
{
    use HasFactory;

    /**
     * Tipe primary key berupa string alfanumerik bukan auto-incrementing integer.
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Kolom-kolom yang dapat diisi secara massal (mass assignable).
     */
    protected $fillable = [
        'id',
        'name',
        'age',
        'gender',
        'phone',
        'email',
        'address',
        'status',
        'last_checked',
        'bp_history',
    ];

    /**
     * Konversi tipe data otomatis (type casting).
     * Kolom bp_history otomatis dikonversi dari JSON string ke PHP array.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bp_history' => 'array',
        ];
    }

    /**
     * Relasi One-to-Many ke riwayat prediksi klasifikasi pasien ini.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function predictions()
    {
        return $this->hasMany(Prediction::class, 'patient_id', 'id');
    }
}
