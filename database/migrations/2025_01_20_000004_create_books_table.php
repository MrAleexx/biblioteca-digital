<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();

            // Información básica del libro
            $table->string('title');
            $table->string('isbn', 20)->unique(); // ISBN-10 o ISBN-13

            // Relaciones con catálogos
            $table->foreignId('publisher_id')
                ->nullable()
                ->constrained('publishers')
                ->onDelete('set null'); // Si se borra editorial, libro queda sin editorial

            $table->string('language_code', 5)->default('es');
            $table->foreign('language_code')
                ->references('code')
                ->on('languages')
                ->onDelete('restrict'); // No se puede borrar idioma si hay libros

            // Datos físicos/técnicos
            $table->integer('pages');
            $table->year('publication_year')->nullable();

            // Archivos
            $table->string('cover_image')->nullable(); // Ruta a la portada
            $table->string('pdf_file')->nullable(); // Ruta al PDF (solo si es digital)

            // Control de estado
            $table->boolean('is_active')->default(true);
            $table->boolean('downloadable')->default(true); // ¿Se puede descargar?

            // Tipo de libro: solo digital, solo físico, o ambos
            $table->enum('book_type', ['digital', 'physical', 'both'])->default('digital');

            // ⚠️ CONTADORES DESNORMALIZADOS (mantener sincronizados)
            // Considera usar queries agregadas en producción
            $table->integer('total_downloads')->default(0);
            $table->integer('total_physical_copies')->default(0);
            $table->integer('available_physical_copies')->default(0);
            $table->integer('total_loans')->default(0);
            $table->integer('total_views')->default(0);

            // Destacado en página principal
            $table->boolean('featured')->default(false);

            // Sistema de acceso (monetización)
            $table->enum('access_level', ['free', 'premium', 'institutional'])->default('free');

            // Información legal (copyright)
            $table->enum('copyright_status', [
                'copyrighted',        // Con copyright
                'public_domain',      // Dominio público
                'creative_commons',    // Creative Commons
            ])->default('copyrighted');
            $table->string('license_type')->nullable(); // Ej: "CC BY-NC-SA 4.0"

            // Fecha de publicación en la plataforma
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->softDeletes(); // ✅ MEJORA: Soft delete crítico para auditoría

            // Índices para performance
            $table->index(['featured', 'is_active']); // Libros destacados activos
            $table->index(['is_active', 'published_at']); // ✅ MEJORA: Para paginación
            $table->index('book_type');
            $table->index('access_level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
