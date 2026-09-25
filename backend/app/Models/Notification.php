<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Model Notifikasi & Jejak Aktivitas Klinis (Notification Model)
 *
 * Menyimpan catatan audit trail setiap tindakan penting di sistem
 * (misal: pendaftaran pasien baru, hasil prediksi berisiko tinggi, perubahan parameter model).
 *
 * @property int $id Identifier unik notifikasi
 * @property int $user_id ID pengguna yang bersangkutan
 * @property string $title Judul notifikasi aktivitas
 * @property string $desc Deskripsi rinci kegiatan
 * @property string $type Jenis/tingkat keparahan ('info', 'success', 'warning', 'danger')
 * @property bool $is_read Status apakah notifikasi sudah dibaca oleh pengguna
 */
class Notification extends Model
{
    /**
     * Kolom-kolom yang dapat diisi secara massal (mass assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'desc',
        'type',
        'is_read',
    ];

    /**
     * Konversi tipe data otomatis (type casting).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_read' => 'boolean',
    ];

    /**
     * Relasi ke dokter/pengguna pemilik notifikasi ini.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper statis untuk mencatat aktivitas dokter ke dalam notifikasi secara ringkas.
     *
     * @param  int|string  $userId  ID pengguna
     * @param  string  $title  Judul notifikasi
     * @param  string  $desc  Deskripsi rinci
     * @param  string  $type  Tipe notifikasi ('info', 'success', 'warning', 'danger')
     * @return self
     */
    public static function logActivity(int|string $userId, string $title, string $desc, string $type = 'info'): self
    {
        return self::create([
            'user_id' => $userId,
            'title' => $title,
            'desc' => $desc,
            'type' => $type,
            'is_read' => false,
        ]);
    }
}
