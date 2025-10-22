<?php

namespace App\Policies;

use App\Models\Book;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Policy de autorización para modelo Book
 *
 * Define quién puede realizar qué operaciones sobre los libros:
 * - Admin: acceso total (crear, editar, eliminar, ver)
 * - Librarian: puede ver y editar, pero NO eliminar
 * - Member: solo puede ver libros activos
 * - Guest: solo puede ver libros activos y gratuitos
 */
class BookPolicy
{
    /**
     * Determina si el usuario puede ver la lista de libros
     *
     * @param User $user Usuario autenticado
     * @return bool True si puede ver listado
     */
    public function viewAny(User $user): bool
    {
        // Todos los usuarios autenticados pueden ver la lista
        return true;
    }

    /**
     * Determina si el usuario puede ver un libro específico
     *
     * @param User $user Usuario autenticado
     * @param Book $book Libro a visualizar
     * @return bool True si puede ver el libro
     */
    public function view(User $user, Book $book): bool
    {
        // Admin y Librarian pueden ver/descargar cualquier libro
        if (in_array($user->role, ['admin', 'librarian'])) {
            return true;
        }

        // Users normales solo pueden ver/descargar libros activos
        return $book->is_active;
    }

    /**
     * Determina si el usuario puede crear nuevos libros
     * 
     * @param User $user Usuario autenticado
     * @return bool True si puede crear
     */
    public function create(User $user): bool
    {
        // Solo admin y librarian pueden crear libros
        return in_array($user->role, ['admin', 'librarian']);
    }

    /**
     * Determina si el usuario puede editar un libro
     * 
     * @param User $user Usuario autenticado
     * @param Book $book Libro a editar
     * @return bool True si puede editar
     */
    public function update(User $user, Book $book): bool
    {
        // Solo admin y librarian pueden editar libros
        return in_array($user->role, ['admin', 'librarian']);
    }

    /**
     * Determina si el usuario puede eliminar un libro
     * 
     * @param User $user Usuario autenticado
     * @param Book $book Libro a eliminar
     * @return bool True si puede eliminar
     */
    public function delete(User $user, Book $book): bool
    {
        // Solo admin puede eliminar libros
        // Librarian NO puede eliminar (solo editar)
        return $user->role === 'admin';
    }

    /**
     * Determina si el usuario puede restaurar un libro eliminado (soft delete)
     * 
     * @param User $user Usuario autenticado
     * @param Book $book Libro a restaurar
     * @return bool True si puede restaurar
     */
    public function restore(User $user, Book $book): bool
    {
        // Solo admin puede restaurar libros eliminados
        return $user->role === 'admin';
    }

    /**
     * Determina si el usuario puede eliminar permanentemente un libro
     * 
     * @param User $user Usuario autenticado
     * @param Book $book Libro a eliminar permanentemente
     * @return bool True si puede eliminar permanentemente
     */
    public function forceDelete(User $user, Book $book): bool
    {
        // Solo admin puede hacer eliminaciones permanentes
        return $user->role === 'admin';
    }
}
