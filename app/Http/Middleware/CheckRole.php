<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware para verificar roles de usuario
 * 
 * Valida que el usuario autenticado tenga uno de los roles permitidos.
 * Si no tiene permiso, redirige al dashboard con error 403.
 * 
 * Uso en rutas:
 * Route::middleware(['auth', 'role:admin,librarian'])->group(...)
 * 
 * @package App\Http\Middleware
 */
class CheckRole
{
    /**
     * Manejar una petición entrante
     *
     * @param Request $request Petición HTTP
     * @param Closure $next Siguiente middleware
     * @param string ...$roles Roles permitidos (ej: 'admin', 'librarian')
     * @return Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Verificar que el usuario esté autenticado
        if (!$request->user()) {
            abort(403, 'No autenticado');
        }

        // Verificar que el usuario tenga uno de los roles permitidos
        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'No tienes permisos para acceder a esta sección');
        }

        return $next($request);
    }
}
