<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard simple (resumen general)
    Route::get('dashboard', function (\Illuminate\Http\Request $request) {
        $user = auth()->user();
        
        $data = ['user' => $user];
        
        // Solo stats para admin/bibliotecario
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
    
    // Gestión de Libros (módulo completo)
    Route::get('books', function (\Illuminate\Http\Request $request) {
        $user = auth()->user();
        
        // Solo admin y bibliotecario pueden acceder
        if ($user->role !== 'admin' && $user->role !== 'librarian') {
            return redirect()->route('dashboard');
        }
        
        // Stats rápidas
        $stats = [
            'total_books' => \App\Models\Book::count(),
            'active_books' => \App\Models\Book::where('is_active', true)->count(),
            'featured_books' => \App\Models\Book::where('featured', true)->count(),
        ];
        
        // Obtener libros con filtros
        $query = \App\Models\Book::with(['publisher', 'language', 'categories', 'contributors']);
        
        // Aplicar filtros solo cuando tienen valor real
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                  ->orWhere('isbn', 'like', '%' . $searchTerm . '%');
            });
        }
        
        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }
        
        if ($request->has('status') && $request->status !== null && $request->status !== '') {
            $query->where('is_active', $request->status === '1');
        }
        
        return Inertia::render('books/index', [
            'books' => $query->latest()->paginate(10)->withQueryString(),
            'categories' => \App\Models\Category::orderBy('name')->get(),
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'status' => $request->status,
            ],
        ]);
    })->name('books.index');
    
    // Rutas CRUD de libros
    Route::resource('books', App\Http\Controllers\BookController::class)->except(['index']);
    Route::post('books/{book}/toggle-status', [App\Http\Controllers\BookController::class, 'toggleStatus'])->name('books.toggle-status');
    Route::post('books/{book}/toggle-featured', [App\Http\Controllers\BookController::class, 'toggleFeatured'])->name('books.toggle-featured');
});

require __DIR__ . '/settings.php';
