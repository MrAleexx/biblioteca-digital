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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            // Información básica
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // Jerarquía (árbol de categorías)
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('categories')
                ->onDelete('cascade'); // Si borras padre, se borran hijos

            // Ordenamiento y visibilidad
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);

            // Imagen para mostrar en UI
            $table->string('image')->nullable();

            // SEO (meta tags)
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamps();
            $table->softDeletes(); // ✅ MEJORA: Soft delete

            // Índices para performance
            $table->index(['parent_id', 'sort_order']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
