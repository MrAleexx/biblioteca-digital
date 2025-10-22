<?php

use App\Http\Controllers\Settings\AppearanceController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;

/**
 * Rutas de configuración de usuario
 * Requiere: autenticación
 */
Route::middleware('auth')->group(function () {
    // Redirección por defecto a perfil
    Route::redirect('settings', '/settings/profile');

    // Configuración de perfil
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Configuración de contraseña (con rate limiting)
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    // Configuración de apariencia (tema claro/oscuro)
    Route::get('settings/appearance', [AppearanceController::class, 'edit'])->name('appearance.edit');

    // Autenticación de dos factores (2FA)
    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
