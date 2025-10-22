<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Book;
use App\Models\User;
use App\Models\Category;
use App\Models\Publisher;

/**
 * Controlador del Dashboard Principal
 * 
 * Maneja la vista principal del sistema después del login.
 * Muestra estadísticas diferentes según el rol del usuario:
 * - Admin/Librarian: Estadísticas completas del sistema
 * - Member/Guest: Vista personalizada sin estadísticas sensibles
 * 
 * @package App\Http\Controllers
 * @author Sistema Biblioteca Digital
 * @version 1.0.0
 */
class DashboardController extends Controller
{
    /**
     * Mostrar el dashboard principal
     * 
     * Carga estadísticas del sistema solo para usuarios con rol
     * de admin o librarian. Otros usuarios ven un dashboard simple.
     * 
     * Estadísticas cargadas:
     * - Total de libros en el catálogo
     * - Libros activos (disponibles públicamente)
     * - Libros destacados (promocionados)
     * - Total de usuarios registrados
     * - Usuarios activos (verificados)
     * - Total de categorías
     * - Total de editoriales
     * 
     * @param Request $request Petición HTTP
     * @return \Inertia\Response Vista del dashboard
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $data = ['user' => $user];

        // Cargar estadísticas solo para admin y bibliotecario
        // Members y guests no necesitan ver estas métricas
        if (in_array($user->role, ['admin', 'librarian'])) {
            $data['stats'] = [
                'total_books' => Book::count(),
                'active_books' => Book::where('is_active', true)->count(),
                'featured_books' => Book::where('featured', true)->count(),
                'total_users' => User::count(),
                'active_users' => User::where('is_active', true)->count(),
                'total_categories' => Category::count(),
                'total_publishers' => Publisher::count(),
            ];
        }

        return Inertia::render('dashboard', $data);
    }
}
