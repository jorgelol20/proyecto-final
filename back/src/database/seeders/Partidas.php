<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Partidas as ModelPartidas;

class Partidas extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ModelPartidas::factory()->create([
            'usuario_id' => 1,
            'personaje_id' => 1,
            'tiempo' => 20000,
            'victoria' => false,
            'rondas' => 3
        ]);
        ModelPartidas::factory()->create([
            'usuario_id' => 1,
            'personaje_id' => 3,
            'tiempo' => 50000,
            'victoria' => true,
            'rondas' => 10
        ]);
    }
}
