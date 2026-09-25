<?php

namespace App\Http\Controllers;

use App\Models\ModelConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\DoctorProfileResource;

/**
 * Controller Pengaturan Sistem & Profil Klinis (Settings Controller)
 * Mengelola preferensi sistem: melihat & mengubah konfigurasi algoritma AI, memperbarui profil dokter,
 * mengubah kata sandi akun dengan verifikasi, serta reset database ke kondisi awal (Factory Reset).
 */
class SettingsController extends Controller
{
    /**
     * Menampilkan konfigurasi hiperparameter model AI yang sedang aktif.
     * Jika konfigurasi belum ada di database, dibuatkan konfigurasi awal secara otomatis.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $config = ModelConfig::first();
        if (!$config) {
            $config = ModelConfig::create([
                'active_model' => 'Random Forest',
                'rf_trees' => 100,
                'rf_max_depth' => 12,
                'dt_min_samples' => 4,
                'lr_iterations' => 200,
                'confidence_factor' => 0.98
            ]);
        }

        return response()->json([
            'activeModel' => $config->active_model,
            'rfTrees' => (int)$config->rf_trees,
            'rfMaxDepth' => (int)$config->rf_max_depth,
            'dtMinSamples' => (int)$config->dt_min_samples,
            'lrIterations' => (int)$config->lr_iterations,
            'confidenceFactor' => (float)$config->confidence_factor,
        ]);
    }

    /**
     * Memperbarui konfigurasi parameter model AI di database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateConfig(Request $request)
    {
        $config = ModelConfig::first();
        if (!$config) {
            $config = new ModelConfig();
        }

        // Validasi batasan rentang nilai parameter algoritma
        $validated = $request->validate([
            'activeModel' => 'sometimes|required|string',
            'rfTrees' => 'sometimes|required|integer|min:50|max:250',
            'rfMaxDepth' => 'sometimes|required|integer|min:4|max:20',
            'dtMinSamples' => 'sometimes|required|integer|min:2|max:10',
            'lrIterations' => 'sometimes|required|integer|min:50|max:1000',
            'confidenceFactor' => 'sometimes|required|numeric|min:0.80|max:1.10',
        ]);

        // Mapping dari properti camelCase (frontend) ke snake_case (kolom database)
        if (isset($validated['activeModel'])) {
            $config->active_model = $validated['activeModel'];
        }
        if (isset($validated['rfTrees'])) {
            $config->rf_trees = $validated['rfTrees'];
        }
        if (isset($validated['rfMaxDepth'])) {
            $config->rf_max_depth = $validated['rfMaxDepth'];
        }
        if (isset($validated['dtMinSamples'])) {
            $config->dt_min_samples = $validated['dtMinSamples'];
        }
        if (isset($validated['lrIterations'])) {
            $config->lr_iterations = $validated['lrIterations'];
        }
        if (isset($validated['confidenceFactor'])) {
            $config->confidence_factor = $validated['confidenceFactor'];
        }

        $config->save();

        // Catat perubahan konfigurasi pada log audit aktivitas
        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Parameter Model Diubah',
            "Mengonfigurasi model klasifikasi aktif menjadi '{$config->active_model}' dengan parameter baru (Trees: {$config->rf_trees}, Depth: {$config->rf_max_depth}).",
            'warning'
        );

        return response()->json([
            'activeModel' => $config->active_model,
            'rfTrees' => (int)$config->rf_trees,
            'rfMaxDepth' => (int)$config->rf_max_depth,
            'dtMinSamples' => (int)$config->dt_min_samples,
            'lrIterations' => (int)$config->lr_iterations,
            'confidenceFactor' => (float)$config->confidence_factor,
        ]);
    }

    /**
     * Memperbarui informasi profil profesional dokter/petugas medis yang sedang masuk.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \App\Http\Resources\DoctorProfileResource
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialty' => 'required|string|max:255',
            'hospital' => 'nullable|string|max:255',
            'avatarUrl' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'],
            'specialty' => $validated['specialty'],
            'hospital' => $validated['hospital'] ?? 'Heart & Vascular Center',
            'avatar_url' => $validated['avatarUrl'] ?? $user->avatar_url,
        ]);

        // Catat aktivitas pembaruan profil ke log audit
        \App\Models\Notification::logActivity(
            $user->id,
            'Profil Dokter Diperbarui',
            "Memperbarui data profil profesional Dr. '{$user->name}' (Spesialisasi: {$user->specialty}, Instansi: {$user->hospital}).",
            'success'
        );

        return new DoctorProfileResource($user);
    }

    /**
     * Mengubah kata sandi akun pengguna dengan verifikasi kata sandi lama.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ], [
            'current_password.required' => 'Kata sandi lama wajib diisi.',
            'new_password.required' => 'Kata sandi baru wajib diisi.',
            'new_password.min' => 'Kata sandi baru minimal 6 karakter.',
            'new_password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $user = $request->user();

        // 1. Verifikasi kecocokan kata sandi lama dengan hash di database
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Kata sandi lama yang Anda masukkan tidak sesuai.'
            ], 422);
        }

        // 2. Enkripsi dan simpan kata sandi baru menggunakan Bcrypt
        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        // 3. Catat aktivitas perubahan kata sandi
        \App\Models\Notification::logActivity(
            $user->id,
            'Kata Sandi Diperbarui',
            "Pengguna Dr. {$user->name} berhasil memperbarui kata sandi akun.",
            'success'
        );

        return response()->json([
            'message' => 'Kata sandi berhasil diperbarui.'
        ]);
    }

    /**
     * Melakukan reset database secara penuh (Factory Reset) kembali ke migrasi awal dan seeder.
     * PERINGATAN: Perintah ini akan menghapus semua data dan membuat ulang data sampel bawaan.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetDatabase()
    {
        // Jalankan perintah php artisan migrate:fresh --seed secara terprogram
        Artisan::call('migrate:fresh', [
            '--seed' => true,
            '--force' => true,
        ]);

        return response()->json([
            'message' => 'Database klinis berhasil di-reset ke nilai bawaan pabrik.'
        ]);
    }
}
