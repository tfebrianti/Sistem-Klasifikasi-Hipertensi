<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use App\Http\Resources\PatientResource;

/**
 * Controller Manajemen Pasien (Patient Controller)
 * Menangani alur data pasien: melihat daftar pasien, detail pasien, registrasi baru,
 * pembaruan demografi klinis, dan penghapusan data pasien.
 */
class PatientController extends Controller
{
    /**
     * Mengambil daftar seluruh pasien terdaftar.
     * Diurutkan berdasarkan tanggal pendaftaran terbaru (LIFO).
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        // Ambil data pasien terurut dari yang paling baru didaftarkan
        $patients = Patient::orderBy('created_at', 'desc')->get();
        return PatientResource::collection($patients);
    }

    /**
     * Menampilkan detail satu rekam medis pasien berdasarkan ID unik.
     *
     * @param  string  $id  ID unik pasien (contoh: PT-2023-001)
     * @return \App\Http\Resources\PatientResource
     */
    public function show(string $id)
    {
        // Cari data pasien atau lempar HTTP 404 jika tidak ditemukan
        $patient = Patient::findOrFail($id);
        return new PatientResource($patient);
    }

    /**
     * Mendaftarkan pasien baru ke dalam registri klinik.
     * Menghasilkan nomor rekam medis otomatis dengan format PT-2023-XXX.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // 1. Validasi masukan data demografi pasien
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:1',
            'gender' => 'required|string|in:L,P',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'status' => 'required|string',
        ]);

        // 2. Generate Nomor Rekam Medis (ID Pasien) otomatis berurutan (3 digit zero-padded)
        $count = Patient::count();
        $generatedId = 'PT-2023-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        // 3. Inisialisasi riwayat tekanan darah awal sebagai baseline observasi berkala
        $mockBPHistory = [
            ['date' => 'Mei', 'systolic' => 120, 'diastolic' => 80],
            ['date' => 'Jun', 'systolic' => 122, 'diastolic' => 81],
            ['date' => 'Jul', 'systolic' => 125, 'diastolic' => 83]
        ];

        // 4. Simpan rekam medis pasien baru ke database MySQL
        $patient = Patient::create([
            'id' => $generatedId,
            'name' => $validated['name'],
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => $validated['status'],
            'last_checked' => now()->toDateString(),
            'bp_history' => $mockBPHistory
        ]);

        // 5. Catat log aktivitas ke dalam audit trail notifikasi
        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Pasien Terdaftar',
            "Mendaftarkan pasien baru '{$patient->name}' (ID: {$patient->id}) ke dalam registri klinis.",
            'success'
        );

        return response()->json(new PatientResource($patient), 201);
    }

    /**
     * Memperbarui informasi profil atau demografi klinis pasien.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id  ID unik pasien
     * @return \App\Http\Resources\PatientResource
     */
    public function update(Request $request, string $id)
    {
        $patient = Patient::findOrFail($id);

        // Validasi input data pembaruan yang bersifat kondisional (sometimes)
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'age' => 'sometimes|required|integer|min:1',
            'gender' => 'sometimes|required|string|in:L,P',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'status' => 'sometimes|required|string',
        ]);

        $patient->update($validated);

        // Catat aktivitas pembaruan ke log notifikasi
        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Data Pasien Diperbarui',
            "Memperbarui profil data klinis untuk pasien '{$patient->name}' (ID: {$patient->id}).",
            'info'
        );

        return new PatientResource($patient);
    }

    /**
     * Menghapus catatan rekam medis pasien dari database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id  ID unik pasien
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, string $id)
    {
        $patient = Patient::findOrFail($id);
        
        // Catat log peringatan audit sebelum penghapusan data
        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Pasien Dihapus',
            "Menghapus data pasien '{$patient->name}' (ID: {$patient->id}) secara permanen dari registri.",
            'danger'
        );

        $patient->delete();

        return response()->json([
            'message' => 'Data pasien berhasil dihapus secara permanen.'
        ]);
    }
}
