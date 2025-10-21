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
        Schema::create('languages', function (Blueprint $table) {
            // Primary key: ISO 639-1 o 639-3 code (ej: 'es', 'en', 'qu')
            $table->string('code', 5)->primary();

            // Nombres del idioma
            $table->string('name', 50); // Nombre en español: "Español", "Inglés"
            $table->string('native_name', 50)->nullable(); // Nombre nativo: "Español", "English"

            // Control de visibilidad
            $table->boolean('is_active')->default(true);

            // No necesita timestamps para catálogo estático
            // pero los agregamos por consistencia
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
