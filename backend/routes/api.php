<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\SettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Authentication Endpoints
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Secure Session-Guarded Endpoints (Sanctum Tokens)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Sessions Profile
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Patients Resource CRUD
    Route::apiResource('patients', PatientController::class);

    // AI Classification & Historical Records
    Route::get('/predictions', [PredictionController::class, 'index']);
    Route::post('/classify', [PredictionController::class, 'store']);
    Route::delete('/predictions/{id}', [PredictionController::class, 'destroy']);

    // Systems Settings & AI Hyperparameters
    Route::get('/settings', [SettingsController::class, 'show']);
    Route::put('/settings', [SettingsController::class, 'updateConfig']);
    Route::put('/profile/update', [SettingsController::class, 'updateProfile']);
    Route::put('/profile/change-password', [SettingsController::class, 'changePassword']);
    
    // Database reset control
    Route::post('/database/reset', [SettingsController::class, 'resetDatabase']);

    // User activity notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy']);
});

