<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuario Administrador
        DB::table('users')->insert([
            'name' => 'Admin',
            'last_name' => 'Sistema',
            'email' => 'admin@biblioteca.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'), // ⚠️ CAMBIAR EN PRODUCCIÓN
            'is_temp_password' => false, // ✅ Contraseña permanente
            'role' => 'admin',
            'dni' => '12345678',
            'phone' => '999888777',
            'is_active' => true,
            'last_login_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Usuario Bibliotecario
        DB::table('users')->insert([
            'name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'bibliotecario@biblioteca.com',
            'email_verified_at' => now(),
            'password' => Hash::make('biblio123'), // ⚠️ CAMBIAR EN PRODUCCIÓN
            'is_temp_password' => false,
            'role' => 'librarian',
            'dni' => '87654321',
            'phone' => '999777666',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Usuario Normal
        DB::table('users')->insert([
            'name' => 'María',
            'last_name' => 'García',
            'email' => 'usuario@ejemplo.com',
            'email_verified_at' => now(),
            'password' => Hash::make('user123'), // ⚠️ CAMBIAR EN PRODUCCIÓN
            'is_temp_password' => false,
            'role' => 'user',
            'dni' => '11223344',
            'phone' => '999666555',
            'is_active' => true,
            'downloads_today' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
