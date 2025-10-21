<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Orden de ejecución importante (respetando foreign keys)
        $this->call([
            LanguageSeeder::class,      // 1. Primero idiomas (sin dependencias)
            PublisherSeeder::class,     // 2. Editoriales (sin dependencias)
            CategorySeeder::class,      // 3. Categorías (sin dependencias)
            UserSeeder::class,          // 4. Usuarios (para created_by, assigned_to)
            BookSeeder::class,          // 5. Libros (depende de languages, publishers, categories)
        ]);

        $this->command->info('✅ Base de datos poblada exitosamente con:');
        $this->command->info('   - 5 idiomas');
        $this->command->info('   - 4 editoriales');
        $this->command->info('   - 10 categorías (8 principales + 2 subcategorías)');
        $this->command->info('   - 3 usuarios (1 admin, 1 bibliotecario, 1 usuario)');
        $this->command->info('   - 10 libros con autores, detalles y categorías');
        $this->command->info('');
        $this->command->info('🔐 Credenciales de acceso:');
        $this->command->info('   Admin: admin@biblioteca.com / admin123');
        $this->command->info('   Bibliotecario: bibliotecario@biblioteca.com / biblio123');
        $this->command->info('   Usuario: usuario@ejemplo.com / user123');
    }
}
