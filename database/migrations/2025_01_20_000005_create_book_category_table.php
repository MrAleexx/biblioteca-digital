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
        Schema::create('book_category', function (Blueprint $table) {
            $table->id();

            // Relación muchos-a-muchos
            $table->foreignId('book_id')
                ->constrained('books')
                ->onDelete('cascade'); // Si se borra libro, se borran relaciones

            $table->foreignId('category_id')
                ->constrained('categories')
                ->onDelete('cascade'); // Si se borra categoría, se borran relaciones

            $table->timestamps();

            // Un libro NO puede estar 2 veces en la misma categoría
            $table->unique(['book_id', 'category_id']);

            // Índices para queries rápidas
            $table->index('book_id');
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_category');
    }
};
