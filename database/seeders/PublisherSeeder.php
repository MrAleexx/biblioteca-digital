<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PublisherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publishers = [
            [
                'name' => 'Editorial San Marcos',
                'city' => 'Lima',
                'country' => 'Perú',
                'website' => 'https://www.editorialsanmarcos.com',
                'is_active' => true,
            ],
            [
                'name' => 'Fondo Editorial PUCP',
                'city' => 'Lima',
                'country' => 'Perú',
                'website' => 'https://fondoeditorial.pucp.edu.pe',
                'is_active' => true,
            ],
            [
                'name' => 'Editorial Planeta',
                'city' => 'Lima',
                'country' => 'Perú',
                'website' => 'https://www.planetadelibros.com.pe',
                'is_active' => true,
            ],
            [
                'name' => 'Alfaguara',
                'city' => 'Lima',
                'country' => 'Perú',
                'website' => 'https://www.penguinlibros.com/pe/alfaguara',
                'is_active' => true,
            ],
        ];

        foreach ($publishers as $publisher) {
            DB::table('publishers')->insert([
                ...$publisher,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
