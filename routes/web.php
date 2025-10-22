<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\DashboardController;

/**
 * Ruta pública - Página de bienvenida
 */
Route::get('/', [HomeController::class, 'index'])->name('home');

/**
 * Rutas autenticadas
 * Requiere: usuario logueado y email verificado
 */
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard principal
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

/**
 * Rutas de gestión de libros
 * Requiere: autenticación + verificación + rol admin/librarian
 * Rate limiting: 60 peticiones por minuto
 */
Route::middleware(['auth', 'verified', 'role:admin,librarian', 'throttle:60,1'])->group(function () {
    // CRUD completo de libros
    Route::resource('books', BookController::class);
    
    // Acciones adicionales sobre libros
    Route::post('books/{book}/toggle-status', [BookController::class, 'toggleStatus'])
        ->name('books.toggle-status');
    Route::post('books/{book}/toggle-featured', [BookController::class, 'toggleFeatured'])
        ->name('books.toggle-featured');
});

// Rutas de configuración de usuario
require __DIR__.'/settings.php';
