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
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            
            // Información del reclamante
            $table->string('name');
            $table->string('dni');
            $table->string('email');
            
            // Tipo de reclamo
            $table->enum('tipo_reclamo', [
                'problema_descarga',    // No puede descargar un libro
                'cobro_indebido',       // Le cobraron mal
                'acceso_cuenta',        // Problemas con su cuenta
                'otro'                  // Otros
            ]);
            
            $table->string('subject');
            $table->text('description'); // ✅ MEJORA: Cambiado de VARCHAR(255) a TEXT
            
            // ✅ MEJORA CRÍTICA: Sistema de gestión de reclamos
            $table->enum('status', [
                'pending',          // Pendiente de revisión
                'in_progress',      // En proceso de atención
                'resolved',         // Resuelto
                'closed',           // Cerrado
                'rejected'          // Rechazado
            ])->default('pending');
            
            // ✅ MEJORA: Prioridad del reclamo
            $table->enum('priority', [
                'low',              // Baja prioridad
                'medium',           // Media
                'high',             // Alta
                'urgent'            // Urgente
            ])->default('medium');
            
            // ✅ MEJORA: ¿Quién atiende el reclamo?
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            
            // ✅ MEJORA: ¿Cuándo se resolvió?
            $table->timestamp('resolved_at')->nullable();
            
            // ✅ MEJORA: Respuesta del staff
            $table->text('resolution_notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes(); // ✅ MEJORA: Soft delete
            
            // Índices para filtros en panel admin
            $table->index('status');
            $table->index('priority');
            $table->index(['status', 'priority']); // Filtro combinado
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
