<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Mostrar detalles de un libro
     */
    public function show(Book $book)
    {
        $book->load(['publisher', 'language', 'categories', 'contributors', 'details']);
        
        return Inertia::render('Books/Show', [
            'book' => $book,
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        return Inertia::render('Books/Create', [
            'publishers' => Publisher::orderBy('name')->get(),
            'languages' => Language::orderBy('name')->get(),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    /**
     * Guardar un nuevo libro
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|max:20|unique:books,isbn',
            'publisher_id' => 'required|exists:publishers,id',
            'language_code' => 'required|exists:languages,code',
            'publication_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
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

        // Generar slug único
        $validated['slug'] = Str::slug($validated['title']);
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Book::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        // Manejar upload de portada
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        // Manejar upload de PDF
        if ($request->hasFile('pdf_file')) {
            $validated['pdf_file'] = $request->file('pdf_file')->store('books', 'public');
        }

        // Crear libro
        $book = Book::create($validated);

        // Asociar categorías
        if (!empty($validated['categories'])) {
            $book->categories()->attach($validated['categories']);
        }

        // Crear contribuyentes (autores, editores, etc.)
        if (!empty($validated['contributors'])) {
            foreach ($validated['contributors'] as $contributor) {
                $book->contributors()->create($contributor);
            }
        }

        return redirect()->route('dashboard')
            ->with('success', 'Libro creado exitosamente');
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Book $book)
    {
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
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|max:20|unique:books,isbn,' . $book->id,
            'publisher_id' => 'required|exists:publishers,id',
            'language_code' => 'required|exists:languages,code',
            'publication_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 1),
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

        // Actualizar slug si el título cambió
        if ($validated['title'] !== $book->title) {
            $validated['slug'] = Str::slug($validated['title']);
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Book::where('slug', $validated['slug'])->where('id', '!=', $book->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        // Manejar nuevo upload de portada
        if ($request->hasFile('cover_image')) {
            // Eliminar portada anterior si existe
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        // Manejar nuevo upload de PDF
        if ($request->hasFile('pdf_file')) {
            // Eliminar PDF anterior si existe
            if ($book->pdf_file) {
                Storage::disk('public')->delete($book->pdf_file);
            }
            $validated['pdf_file'] = $request->file('pdf_file')->store('books', 'public');
        }

        // Actualizar libro
        $book->update($validated);

        // Sincronizar categorías
        if (isset($validated['categories'])) {
            $book->categories()->sync($validated['categories']);
        }

        // Actualizar contribuyentes
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
     * Eliminar un libro (soft delete)
     */
    public function destroy(Book $book)
    {
        // Soft delete gracias al trait SoftDeletes en el modelo
        $book->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Libro eliminado exitosamente');
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public function toggleStatus(Book $book)
    {
        $book->update([
            'is_active' => !$book->is_active
        ]);

        return back()->with('success', 'Estado del libro actualizado');
    }

    /**
     * Cambiar estado destacado
     */
    public function toggleFeatured(Book $book)
    {
        $book->update([
            'featured' => !$book->featured
        ]);

        return back()->with('success', 'Libro ' . ($book->featured ? 'destacado' : 'no destacado'));
    }
}
