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
        Schema::create('publishers', function (Blueprint $table) {
            $table->id();

            // Información de la editorial
            $table->string('name')->unique();
            $table->string('city')->nullable();
            $table->string('country')->default('Perú');
            $table->string('website')->nullable();

            // Control de visibilidad
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes(); // ✅ MEJORA: Soft delete para no perder historial
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publishers');
    }
};
