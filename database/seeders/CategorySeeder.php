<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Categorías principales
            [
                'name' => 'Literatura',
                'slug' => 'literatura',
                'description' => 'Novelas, cuentos, poesía y obras literarias',
                'parent_id' => null,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Ciencias',
                'slug' => 'ciencias',
                'description' => 'Libros de ciencias naturales, física, química y biología',
                'parent_id' => null,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Historia',
                'slug' => 'historia',
                'description' => 'Historia del Perú y el mundo',
                'parent_id' => null,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Tecnología',
                'slug' => 'tecnologia',
                'description' => 'Programación, desarrollo web, inteligencia artificial',
                'parent_id' => null,
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Educación',
                'slug' => 'educacion',
                'description' => 'Pedagogía, didáctica y métodos educativos',
                'parent_id' => null,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Derecho',
                'slug' => 'derecho',
                'description' => 'Leyes, jurisprudencia y normativas',
                'parent_id' => null,
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Medicina',
                'slug' => 'medicina',
                'description' => 'Medicina, salud pública y enfermería',
                'parent_id' => null,
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Economía',
                'slug' => 'economia',
                'description' => 'Economía, finanzas y administración',
                'parent_id' => null,
                'sort_order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert([
                ...$category,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Subcategorías (ejemplo)
        $literaturaId = DB::table('categories')->where('slug', 'literatura')->value('id');

        $subcategories = [
            [
                'name' => 'Novela Peruana',
                'slug' => 'novela-peruana',
                'description' => 'Novelas de autores peruanos',
                'parent_id' => $literaturaId,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Poesía',
                'slug' => 'poesia',
                'description' => 'Poesía nacional e internacional',
                'parent_id' => $literaturaId,
                'sort_order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($subcategories as $subcategory) {
            DB::table('categories')->insert([
                ...$subcategory,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
