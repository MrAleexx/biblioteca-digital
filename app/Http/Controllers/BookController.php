<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Language;
use App\Models\Publisher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * Controlador para la gestión completa de libros
 * 
 * Maneja todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) 
 * para el catálogo de libros de la biblioteca digital.
 * 
 * Funcionalidades principales:
 * - Listar libros con filtros (búsqueda, categoría, estado)
 * - Crear nuevos libros con metadatos completos
 * - Editar libros existentes (incluyendo portada y PDF)
 * - Eliminar libros (soft delete)
 * - Activar/desactivar libros
 * - Marcar libros como destacados
 * 
 * Relaciones gestionadas:
 * - Categorías (muchos a muchos)
 * - Contribuidores/Autores (uno a muchos)
 * - Detalles extendidos (uno a uno)
 * - Editorial (muchos a uno)
 * - Idioma (muchos a uno)
 * 
 * @package App\Http\Controllers
 * @author Sistema Biblioteca Digital
 * @version 1.0.0
 */
class BookController extends Controller
{
    use AuthorizesRequests;

    /**
     * Listar libros con filtros y paginación
     * 
     * Muestra el catálogo completo de libros con capacidad de:
     * - Búsqueda por título o ISBN
     * - Filtrado por categoría
     * - Filtrado por estado (activo/inactivo)
     * - Paginación de 10 libros por página
     * 
     * Carga eager de relaciones para evitar N+1 queries.
     * Verifica autorización con BookPolicy::viewAny
     * 
     * @param Request $request Petición con filtros opcionales (search, category, status)
     * @return \Inertia\Response Vista de gestión de libros
     */
    public function index(Request $request)
    {
        // Verificar autorización para ver lista de libros
        $this->authorize('viewAny', Book::class);

        // Estadísticas rápidas del catálogo
        $stats = [
            'total_books' => Book::count(),
            'active_books' => Book::where('is_active', true)->count(),
            'featured_books' => Book::where('featured', true)->count(),
        ];

        // Iniciar query con relaciones (eager loading)
        $query = Book::with(['publisher', 'language', 'categories', 'contributors']);

        // Aplicar filtro de búsqueda (título o ISBN)
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%'.$searchTerm.'%')
                  ->orWhere('isbn', 'like', '%'.$searchTerm.'%');
            });
        }

        // Aplicar filtro de categoría
        if ($request->filled('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }

        // Aplicar filtro de estado (activo/inactivo)
        if ($request->filled('status')) {
            $isActive = $request->status === '1';
            $query->where('is_active', $isActive);
        }

        // Paginar resultados (10 por página) y mantener query string
        $books = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('books/index', [
            'books' => $books,
            'categories' => Category::orderBy('name')->get(),
            'stats' => $stats,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    /**
     * Mostrar detalles completos de un libro específico
     * 
     * Carga todas las relaciones del libro para mostrar información completa.
     * 
     * @param Book $book El libro a mostrar (inyección automática por Route Model Binding)
     * @return \Inertia\Response Vista de detalles del libro
     */
    public function show(Book $book)
    {
        $book->load(['publisher', 'language', 'categories', 'contributors', 'details']);

        return Inertia::render('Books/Show', [
            'book' => $book,
        ]);
    }

    /**
     * Mostrar formulario para crear un nuevo libro
     * 
     * Carga los catálogos necesarios para los campos select del formulario.
     * Verifica autorización con BookPolicy::create
     * 
     * @return \Inertia\Response Formulario de creación con catálogos
     */
    public function create()
    {
        // Verificar que el usuario tenga permiso para crear libros
        $this->authorize('create', Book::class);

        return Inertia::render('Books/Create', [
            'publishers' => Publisher::orderBy('name')->get(),
            'languages' => Language::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Guardar un nuevo libro en la base de datos
     * 
     * Proceso completo:
     * 1. Verifica autorización (BookPolicy::create)
     * 2. Valida todos los campos del formulario
     * 3. Genera slug único para URL amigable
     * 4. Sube portada e imagen (si existen)
     * 5. Crea el registro del libro
     * 6. Asocia categorías (relación muchos a muchos)
     * 7. Crea registros de contribuidores (autores, editores, etc.)
     * 8. Crea registro de detalles extendidos
     * 
     * @param Request $request Datos del formulario validados
     * @return \Illuminate\Http\RedirectResponse Redirección con mensaje de éxito
     * @throws \Illuminate\Validation\ValidationException Si los datos no son válidos
     */
    public function store(Request $request)
    {
        // Verificar autorización antes de crear
        $this->authorize('create', Book::class);

        // Validación de todos los campos del formulario
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|max:20|unique:books,isbn',
            'publisher_id' => 'required|exists:publishers,id',
            'language_code' => 'required|exists:languages,code',
            'publication_year' => 'nullable|integer|min:1000|max:'.(date('Y') + 1),
            'pages' => 'nullable|integer|min:1',
            'book_type' => 'required|in:digital,physical,both',
            'access_level' => 'required|in:free,premium,loan_only',
            'copyright_status' => 'required|in:copyrighted,public_domain,creative_commons',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048', // 2MB max
            'pdf_file' => 'nullable|file|mimes:pdf|max:51200', // 50MB max
            'is_active' => 'boolean',
            'featured' => 'boolean',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'contributors' => 'array',
            'contributors.*.full_name' => 'required|string|max:255',
            'contributors.*.contributor_type' => 'required|in:author,editor,translator,illustrator,other',
        ]);

        // Generar slug único para URLs amigables (ej: /books/cien-años-de-soledad)
        $validated['slug'] = Str::slug($validated['title']);
        $originalSlug = $validated['slug'];
        $counter = 1;
        
        // Si el slug ya existe, agregar un número al final
        while (Book::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug.'-'.$counter;
            $counter++;
        }

        // Manejar upload de portada (storage/app/public/covers/)
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        // Manejar upload de PDF (storage/app/public/books/)
        if ($request->hasFile('pdf_file')) {
            $validated['pdf_file'] = $request->file('pdf_file')->store('books', 'public');
        }

        // Crear el libro en la base de datos
        $book = Book::create($validated);

        // Asociar categorías (tabla pivot book_category)
        if (! empty($validated['categories'])) {
            $book->categories()->attach($validated['categories']);
        }

        // Crear contribuyentes (autores, editores, traductores, etc.)
        if (! empty($validated['contributors'])) {
            foreach ($validated['contributors'] as $contributor) {
                $book->contributors()->create($contributor);
            }
        }

        return redirect()->route('dashboard')
            ->with('success', 'Libro creado exitosamente');
    }

    /**
     * Mostrar formulario de edición de un libro existente
     * 
     * Carga el libro con sus relaciones y los catálogos necesarios.
     * 
     * @param Book $book El libro a editar (inyección automática)
     * @return \Inertia\Response Formulario de edición pre-llenado
     */
    public function edit(Book $book)
    {
        // Cargar relaciones para pre-llenar el formulario
        $book->load(['categories', 'contributors']);

        return Inertia::render('Books/Edit', [
            'book' => $book,
            'publishers' => Publisher::orderBy('name')->get(),
            'languages' => Language::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Actualizar un libro existente
     * 
     * Proceso completo:
     * 1. Valida los campos (ISBN único excepto el libro actual)
     * 2. Actualiza slug si cambió el título
     * 3. Sube nueva portada/PDF (si se proporcionan) y elimina los anteriores
     * 4. Actualiza el libro en la base de datos
     * 5. Sincroniza categorías (elimina no seleccionadas, agrega nuevas)
     * 6. Actualiza contribuidores (elimina todos y recrea)
     * 
     * @param Request $request Datos del formulario validados
     * @param Book $book El libro a actualizar
     * @return \Illuminate\Http\RedirectResponse Redirección con mensaje de éxito
     * @throws \Illuminate\Validation\ValidationException Si los datos no son válidos
     */
    public function update(Request $request, Book $book)
    {
        // Verificar autorización antes de actualizar
        $this->authorize('update', $book);

        // Validación (ISBN puede ser el mismo del libro actual)
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|max:20|unique:books,isbn,'.$book->id,
            'publisher_id' => 'required|exists:publishers,id',
            'language_code' => 'required|exists:languages,code',
            'publication_year' => 'nullable|integer|min:1000|max:'.(date('Y') + 1),
            'pages' => 'nullable|integer|min:1',
            'book_type' => 'required|in:digital,physical,both',
            'access_level' => 'required|in:free,premium,loan_only',
            'copyright_status' => 'required|in:copyrighted,public_domain,creative_commons',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'pdf_file' => 'nullable|file|mimes:pdf|max:51200',
            'is_active' => 'boolean',
            'featured' => 'boolean',
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
            'contributors' => 'array',
            'contributors.*.full_name' => 'required|string|max:255',
            'contributors.*.contributor_type' => 'required|in:author,editor,translator,illustrator,other',
        ]);

        // Actualizar slug solo si el título cambió
        if ($validated['title'] !== $book->title) {
            $validated['slug'] = Str::slug($validated['title']);
            $originalSlug = $validated['slug'];
            $counter = 1;
            // Asegurar que el slug sea único (excepto el libro actual)
            while (Book::where('slug', $validated['slug'])->where('id', '!=', $book->id)->exists()) {
                $validated['slug'] = $originalSlug.'-'.$counter;
                $counter++;
            }
        }

        // Manejar nuevo upload de portada (elimina la anterior)
        if ($request->hasFile('cover_image')) {
            // Eliminar portada anterior del storage si existe
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        // Manejar nuevo upload de PDF (elimina el anterior)
        if ($request->hasFile('pdf_file')) {
            // Eliminar PDF anterior del storage si existe
            if ($book->pdf_file) {
                Storage::disk('public')->delete($book->pdf_file);
            }
            $validated['pdf_file'] = $request->file('pdf_file')->store('books', 'public');
        }

        // Actualizar el libro en la base de datos
        $book->update($validated);

        // Sincronizar categorías (sync elimina las no seleccionadas y agrega nuevas)
        if (isset($validated['categories'])) {
            $book->categories()->sync($validated['categories']);
        }

        // Actualizar contribuidores (eliminamos todos y recreamos)
        if (isset($validated['contributors'])) {
            // Eliminar contribuyentes existentes
            $book->contributors()->delete();

            // Crear nuevos contribuyentes
            foreach ($validated['contributors'] as $contributor) {
                $book->contributors()->create($contributor);
            }
        }

        return redirect()->route('dashboard')
            ->with('success', 'Libro actualizado exitosamente');
    }

    /**
     * Eliminar un libro de forma lógica (soft delete)
     * 
     * No elimina físicamente el registro, solo lo marca como eliminado.
     * Esto permite recuperar el libro más tarde si es necesario.
     * Requiere el trait SoftDeletes en el modelo Book.
     * Verifica autorización con BookPolicy::delete (solo admin)
     * 
     * @param Book $book El libro a eliminar
     * @return \Illuminate\Http\RedirectResponse Redirección con mensaje de éxito
     */
    public function destroy(Book $book)
    {
        // Verificar autorización (solo admin puede eliminar)
        $this->authorize('delete', $book);

        // Soft delete (campo deleted_at se llena con timestamp actual)
        $book->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Libro eliminado exitosamente');
    }

    /**
     * Activar o desactivar un libro
     * 
     * Alterna el estado is_active del libro entre true y false.
     * Los libros inactivos no se muestran al público en el catálogo.
     * Requiere autorización de BookPolicy::update
     * 
     * @param Book $book El libro a cambiar estado
     * @return \Illuminate\Http\RedirectResponse Redirección al listado
     */
    public function toggleStatus(Book $book)
    {
        // Verificar autorización (solo admin/librarian pueden cambiar estado)
        $this->authorize('update', $book);

        // Alternar el estado (true -> false o false -> true)
        $book->update([
            'is_active' => ! $book->is_active,
        ]);

        $status = $book->is_active ? 'activado' : 'desactivado';
        return back()->with('success', "Libro $status correctamente");
    }

    /**
     * Marcar o desmarcar libro como destacado
     * 
     * Los libros destacados se muestran en la página principal.
     * Útil para promocionar libros nuevos o populares.
     * Requiere autorización de BookPolicy::update
     * 
     * @param Book $book El libro a cambiar estado de destacado
     * @return \Illuminate\Http\RedirectResponse Redirección al listado
     */
    public function toggleFeatured(Book $book)
    {
        // Verificar autorización (solo admin/librarian pueden destacar libros)
        $this->authorize('update', $book);

        // Alternar el estado destacado
        $book->update([
            'featured' => ! $book->featured,
        ]);

        $message = $book->featured ? 'marcado como destacado' : 'desmarcado como destacado';
        return back()->with('success', "Libro $message correctamente");
    }
}

