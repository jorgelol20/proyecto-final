<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partidas as ModelPartidas;
use App\Models\Usuarios;
use App\Models\Modificadores;

class Partidas extends Seeder
{
    public function run(): void
    {
        // 1. Creamos la primera partida y la guardamos en una variable
        $partida1 = ModelPartidas::factory()->create([
            'usuario_id' => 1,
            'personaje_id' => 1,
            'tiempo' => 20000,
            'victoria' => false,
            'rondas' => 3
        ]);

        // Añadir Modificadores (IDs 1 y 2 por ejemplo)
        $partida1->modificadores()->attach([1, 2]);

        // Añadir Comentario (Relación con Usuarios)
        // El usuario con ID 2 comenta en la partida del usuario ID 1
        $partida1->comentarios()->attach(1, [
            'comentario' => '¡Estuvo cerca! Buen intento.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // 2. Segunda partida
        $partida2 = ModelPartidas::factory()->create([
            'usuario_id' => 1,
            'personaje_id' => 3,
            'tiempo' => 50000,
            'victoria' => true,
            'rondas' => 10
        ]);

        // Añadir modificadores
        $partida2->modificadores()->attach([3]);

        // Añadir múltiples comentarios
        $partida2->comentarios()->attach([
            1 => ['comentario' => '¡Increíble remontada!', 'created_at' => now()],
            2 => ['comentario' => 'Ese personaje está roto...', 'created_at' => now()],
        ]);
    }
}