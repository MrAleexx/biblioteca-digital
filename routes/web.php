<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - Vista general con estadísticas
    Route::get('dashboard', function (Request $request) {
        $user = Auth::user();

        $data = ['user' => $user];

        // Cargar estadísticas solo para admin/bibliotecario
        if ($user->role === 'admin' || $user->role === 'librarian') {
            $data['stats'] = [
                'total_books' => \App\Models\Book::count(),
                'active_books' => \App\Models\Book::where('is_active', true)->count(),
                'featured_books' => \App\Models\Book::where('featured', true)->count(),
                'total_users' => \App\Models\User::count(),
                'active_users' => \App\Models\User::where('is_active', true)->count(),
                'total_categories' => \App\Models\Category::count(),
                'total_publishers' => \App\Models\Publisher::count(),
            ];
        }

        return Inertia::render('dashboard', $data);
    })->name('dashboard');
});

// Rutas de gestión de libros (solo admin y bibliotecario)
// Rate limiting: máximo 60 peticiones por minuto para evitar abuso
Route::middleware(['auth', 'verified', 'role:admin,librarian', 'throttle:60,1'])->group(function () {
    Route::resource('books', App\Http\Controllers\BookController::class);
    Route::post('books/{book}/toggle-status', [App\Http\Controllers\BookController::class, 'toggleStatus'])
        ->name('books.toggle-status');
    Route::post('books/{book}/toggle-featured', [App\Http\Controllers\BookController::class, 'toggleFeatured'])
        ->name('books.toggle-featured');
});

require __DIR__.'/settings.php';
