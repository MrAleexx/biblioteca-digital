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
        Schema::create('book_contributors', function (Blueprint $table) {
            $table->id();

            // Relación con libro
            $table->foreignId('book_id')
                ->constrained('books')
                ->onDelete('cascade');

            // ✅ MEJORA: Cambiado de VARCHAR a ENUM (evita inconsistencias)
            $table->enum('contributor_type', [
                'author',       // Autor principal
                'co-author',    // Coautor
                'editor',       // Editor
                'translator',   // Traductor
                'illustrator',  // Ilustrador
                'compiler',      // Compilador
            ])->default('author');

            // Información del contribuyente
            $table->string('full_name', 200);
            $table->string('email', 100)->nullable();

            // Orden de aparición (para múltiples autores)
            $table->integer('sequence_number')->default(1);

            // Biografía corta
            $table->text('biographical_note')->nullable();

            $table->timestamps();
            $table->softDeletes(); // ✅ MEJORA: Soft delete

            // Índices para ordenar autores correctamente
            $table->index(['book_id', 'sequence_number']);
            $table->index('contributor_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_contributors');
    }
};
