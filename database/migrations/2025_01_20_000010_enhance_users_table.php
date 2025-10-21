<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Esta migración MEJORA la tabla users existente que viene con Laravel.
     * Agrega campos específicos del sistema de biblioteca.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Información adicional del usuario
            $table->string('last_name', 100)->after('name');
            $table->string('dni')->unique()->nullable()->after('email');
            $table->string('phone')->unique()->nullable()->after('dni');

            // OAuth providers
            $table->string('institutional_email')->nullable()->after('email');
            $table->string('microsoft_id')->unique()->nullable()->after('password');
            $table->string('google_id')->unique()->nullable()->after('microsoft_id');

            // Sistema de contraseñas temporales
            // ✅ FIX CRÍTICO: Cambiado DEFAULT de '1' a '0'
            // Un usuario NO debe tener contraseña temporal por defecto
            $table->boolean('is_temp_password')->default(false)->after('password');
            $table->timestamp('temp_password_expires_at')->nullable()->after('is_temp_password');

            // Roles del sistema
            $table->enum('role', ['admin', 'librarian', 'user'])->default('user')->after('remember_token');

            // ⚠️ Sistema de límite de descargas diarias
            // NOTA: Considera eliminar estos campos y calcular desde user_downloads
            // para evitar desincronización
            $table->integer('downloads_today')->default(0)->after('role');
            $table->date('last_download_reset')->nullable()->after('downloads_today');

            // Auditoría: ¿Quién creó este usuario?
            $table->foreignId('created_by')
                ->nullable()
                ->after('last_download_reset')
                ->constrained('users')
                ->onDelete('set null');

            // Control de cuenta
            $table->boolean('is_active')->default(true)->after('created_by');
            $table->timestamp('last_login_at')->nullable()->after('is_active');

            // ✅ MEJORA CRÍTICA: Soft delete para auditoría
            $table->softDeletes();

            // ✅ MEJORA: Índices para búsquedas frecuentes
            $table->index('dni');
            $table->index('phone');
            $table->index('role');
            $table->index(['role', 'is_active']); // Filtro combinado
            $table->index('google_id');
            $table->index('microsoft_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Eliminar índices primero
            $table->dropIndex(['users_dni_index']);
            $table->dropIndex(['users_phone_index']);
            $table->dropIndex(['users_role_index']);
            $table->dropIndex(['users_role_is_active_index']);
            $table->dropIndex(['users_google_id_index']);
            $table->dropIndex(['users_microsoft_id_index']);

            // Eliminar foreign key
            $table->dropForeign(['created_by']);

            // Eliminar columnas
            $table->dropColumn([
                'last_name',
                'dni',
                'phone',
                'institutional_email',
                'microsoft_id',
                'google_id',
                'is_temp_password',
                'temp_password_expires_at',
                'role',
                'downloads_today',
                'last_download_reset',
                'created_by',
                'is_active',
                'last_login_at',
                'deleted_at',
            ]);
        });
    }
};
