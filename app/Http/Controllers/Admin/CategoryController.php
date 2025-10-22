<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Listar categorías con paginación
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Category::class);

        $query = Category::with(['parent', 'children']);

        // Filtro de búsqueda
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('description', 'like', '%' . $searchTerm . '%');
            });
        }

        // Filtro por tipo (principal/secundaria)
        if ($request->filled('type')) {
            if ($request->type === 'parent') {
                $query->whereNull('parent_id');
            } elseif ($request->type === 'child') {
                $query->whereNotNull('parent_id');
            }
        }

        // Filtro por estado
        if ($request->filled('status')) {
            $isActive = $request->status === '1';
            $query->where('is_active', $isActive);
        }

        $categories = $query->orderBy('parent_id')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $stats = [
            'total_categories' => Category::count(),
            'parent_categories' => Category::whereNull('parent_id')->count(),
            'child_categories' => Category::whereNotNull('parent_id')->count(),
            'active_categories' => Category::where('is_active', true)->count(),
        ];

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'parent_categories' => Category::whereNull('parent_id')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
            'stats' => $stats,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        $this->authorize('create', Category::class);

        return Inertia::render('admin/categories/create', [
            'parent_categories' => Category::whereNull('parent_id')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Guardar nueva categoría
     */
    public function store(Request $request)
    {
        $this->authorize('create', Category::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        // Generar slug único
        $validated['slug'] = Str::slug($validated['name']);
        $originalSlug = $validated['slug'];
        $counter = 1;

        while (Category::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Manejar upload de imagen
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        // Establecer sort_order por defecto
        if (!isset($validated['sort_order'])) {
            $maxOrder = Category::where('parent_id', $validated['parent_id'] ?? null)
                ->max('sort_order') ?? 0;
            $validated['sort_order'] = $maxOrder + 1;
        }

        Category::create($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría creada exitosamente');
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        $category->load(['parent', 'children']);

        return Inertia::render('admin/categories/edit', [
            'category' => $category,
            'parent_categories' => Category::whereNull('parent_id')
                ->where('is_active', true)
                ->where('id', '!=', $category->id)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Actualizar categoría
     */
    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        // Actualizar slug si el nombre cambió
        if ($validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
            $originalSlug = $validated['slug'];
            $counter = 1;

            while (Category::where('slug', $validated['slug'])->where('id', '!=', $category->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Manejar upload de imagen (eliminar anterior si existe)
        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        // Evitar que una categoría sea su propio padre
        if ($validated['parent_id'] == $category->id) {
            return back()->withErrors(['parent_id' => 'Una categoría no puede ser su propio padre.']);
        }

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría actualizada exitosamente');
    }

    /**
     * Eliminar categoría (soft delete)
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        // Verificar si tiene categorías hijas
        if ($category->children()->count() > 0) {
            return back()->with('error', 'No se puede eliminar una categoría que tiene subcategorías.');
        }

        // Verificar si tiene libros asociados
        if ($category->books()->count() > 0) {
            return back()->with('error', 'No se puede eliminar una categoría que tiene libros asociados.');
        }

        $category->delete();

        return back()->with('success', 'Categoría eliminada exitosamente');
    }

    /**
     * Alternar estado activo/inactivo
     */
    public function toggleStatus(Category $category)
    {
        $this->authorize('update', $category);

        $category->update([
            'is_active' => !$category->is_active,
        ]);

        $status = $category->is_active ? 'activada' : 'desactivada';
        return back()->with('success', "Categoría $status correctamente");
    }

    /**
     * Obtener categorías para selects (API)
     */
    public function getCategories(Request $request)
    {
        $query = Category::where('is_active', true);

        if ($request->filled('parent_only')) {
            $query->whereNull('parent_id');
        }

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }

        return $query->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);
    }
}
