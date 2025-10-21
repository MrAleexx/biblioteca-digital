<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = [
            ['code' => 'es', 'name' => 'Español', 'native_name' => 'Español', 'is_active' => true],
            ['code' => 'en', 'name' => 'Inglés', 'native_name' => 'English', 'is_active' => true],
            ['code' => 'qu', 'name' => 'Quechua', 'native_name' => 'Runa Simi', 'is_active' => true],
            ['code' => 'ay', 'name' => 'Aimara', 'native_name' => 'Aymar aru', 'is_active' => true],
            ['code' => 'pt', 'name' => 'Portugués', 'native_name' => 'Português', 'is_active' => true],
        ];

        foreach ($languages as $language) {
            DB::table('languages')->insert([
                ...$language,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
