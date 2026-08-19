<?php

use App\Http\Controllers\Api\Auth\AuthController;
use Illuminate\Support\Facades\Route;

// Firebase Auth Routes
Route::post('auth/firebase-login', [AuthController::class, 'firebaseLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/profile', [AuthController::class, 'profile']);
    Route::match(['put', 'patch'], 'user/profile', [AuthController::class, 'updateProfile']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Protected Customer API Routes
    Route::middleware('role:customer')->prefix('customer')->group(function () {});

    // Protected Provider API Routes
    Route::middleware('role:provider')->prefix('provider')->group(function () {});
});
