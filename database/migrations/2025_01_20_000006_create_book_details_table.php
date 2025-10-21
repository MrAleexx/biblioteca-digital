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
        Schema::create('book_details', function (Blueprint $table) {
            $table->id();

            // Relación 1:1 con books
            $table->foreignId('book_id')
                ->unique() // Un libro tiene UNA fila de detalles
                ->constrained('books')
                ->onDelete('cascade');

            // Descripción larga del libro
            $table->text('description')->nullable();

            // Información de edición
            $table->string('edition')->default('1ra'); // "1ra", "2da edición revisada"

            // Información técnica del archivo digital
            $table->string('file_format')->default('PDF'); // PDF, EPUB, MOBI
            $table->string('file_size')->nullable(); // "5.2 MB"

            // Edad recomendada
            $table->string('reading_age')->nullable(); // "12+", "Adultos"

            // Información legal peruana
            $table->string('deposito_legal')->nullable(); // Número de depósito legal

            // Restricciones de uso
            $table->text('restrictions')->nullable();

            // Notas adicionales
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes(); // ✅ MEJORA: Soft delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_details');
    }
};
