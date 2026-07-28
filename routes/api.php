<?php

use App\Http\Controllers\Api\Customer\AuthController as CustomerAuthController;
use App\Http\Controllers\Api\Provider\AuthController as ProviderAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Customer App Login & Register
Route::post('customer/login', [CustomerAuthController::class, 'login']);
Route::post('customer/register', [CustomerAuthController::class, 'register']);

// Provider App Login & Register
Route::post('provider/login', [ProviderAuthController::class, 'login']);
Route::post('provider/register', [ProviderAuthController::class, 'register']);

// Protected Customer API Routes
Route::middleware(['auth:sanctum', 'role:customer'])->prefix('customer')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Protected Provider API Routes
Route::middleware(['auth:sanctum', 'role:provider'])->prefix('provider')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
