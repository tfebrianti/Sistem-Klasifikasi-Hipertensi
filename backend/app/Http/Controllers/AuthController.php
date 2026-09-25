<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Http\Resources\DoctorProfileResource;

/**
 * Controller Otentikasi & Akun Tenaga Medis (Auth Controller)
 * Menangani siklus autentikasi dokter/petugas: login dengan token Sanctum, registrasi akun baru,
 * melihat profil klinisi, logout, serta alur pemulihan kata sandi (forgot & reset password).
 */
class AuthController extends Controller
{
    /**
     * Otentikasi klinisi dan pembuatan Bearer Token Sanctum.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // 1. Validasi input kredensial masuk
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // 2. Cari pengguna berdasarkan username
        $user = User::where('username', $credentials['username'])->first();

        // 3. Verifikasi keberadaan user dan kecocokan hash password
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Username atau Password salah.'
            ], 401);
        }

        // 4. Cabut token lama jika ada untuk mencegah token ganda
        $user->tokens()->delete();

        // 5. Buat token akses pribadi baru via Laravel Sanctum
        $token = $user->createToken('clinician-session')->plainTextToken;

        // 6. Catat aktivitas login berhasil ke audit trail notifikasi
        \App\Models\Notification::logActivity(
            $user->id,
            'Sesi Masuk Berhasil',
            "Pengguna Dr. {$user->name} berhasil masuk ke dalam sistem intelligence.",
            'success'
        );

        return response()->json([
            'token' => $token,
            'doctor' => new DoctorProfileResource($user)
        ]);
    }

    /**
     * Mengambil data profil tenaga medis yang sedang login.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \App\Http\Resources\DoctorProfileResource
     */
    public function profile(Request $request)
    {
        return new DoctorProfileResource($request->user());
    }

    /**
     * Mengakhiri sesi masuk pengguna dan menghapus token akses aktif.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Catat aktivitas keluar sesi ke audit trail notifikasi
        \App\Models\Notification::logActivity(
            $user->id,
            'Keluar Sistem',
            "Sesi masuk Dr. {$user->name} telah diakhiri dengan aman.",
            'info'
        );

        // Hapus token akses yang sedang digunakan saat ini
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout, session token dicabut.'
        ]);
    }

    /**
     * Mendaftarkan akun tenaga medis / pengguna baru.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Validasi data pendaftaran dengan pesan kesalahan berbahasa Indonesia
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'username.unique' => 'Username sudah digunakan.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 6 karakter.',
        ]);

        // Buat akun pengguna baru dengan spesialisasi default Puskesmas Kembaran 1
        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'specialty' => 'Puskesmas Kembaran 1',
            'hospital' => 'Dinas Kesehatan Banyumas',
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan login.'
        ], 201);
    }

    /**
     * Membuat token pemulihan kata sandi (Forgot Password).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email tidak ditemukan dalam sistem.'
            ], 404);
        }

        // Hapus token lama yang belum digunakan untuk email ini
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Buat token alfanumerik 6 karakter huruf kapital
        $token = strtoupper(Str::random(6));

        // Simpan hash token ke database beserta timestamp pembuatan
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // Pada mode lokal/pengembangan, token ditampilkan langsung pada respons JSON
        return response()->json([
            'message' => "Token reset password telah dibuat. Gunakan token berikut: {$token}",
        ]);
    }

    /**
     * Mereset kata sandi menggunakan token verifikasi 6 karakter.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Token tidak ditemukan. Silakan minta token baru.'
            ], 400);
        }

        // Cek masa berlaku token (maksimal 60 menit)
        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Token telah kadaluarsa. Silakan minta token baru.'
            ], 400);
        }

        // Verifikasi kesesuaian token yang dimasukkan dengan hash di database
        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'message' => 'Token tidak valid.'
            ], 400);
        }

        // Simpan kata sandi baru pengguna
        $user = User::where('email', $request->email)->first();
        $user->password = $request->password;
        $user->save();

        // Bersihkan token yang sudah berhasil digunakan
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password berhasil direset. Silakan login dengan password baru.'
        ]);
    }
}
