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
        Schema::create('contacts', function (Blueprint $table) {
            // ✅ FIX CRÍTICO: Agregar PRIMARY KEY (faltaba en dump original)
            $table->id();

            // Información del contacto
            $table->string('name', 60);
            $table->string('email', 100);
            $table->string('subject', 60);
            $table->text('message');

            // ✅ MEJORA: Agregar estado para tracking
            $table->enum('status', [
                'new',          // Recién recibido
                'read',         // Leído por staff
                'replied',      // Respondido
                'closed',        // Cerrado
            ])->default('new');

            // ✅ MEJORA: ¿Quién atendió?
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->timestamps();
            $table->softDeletes(); // ✅ MEJORA: Soft delete

            // Índices
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
