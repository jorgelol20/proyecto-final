<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Habilidad as ModelHabilidad;

class Habilidades extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $habilidadesData = [
            [
                'nombre' => 'Grito de guerra',
                'descripcion' => 'Cambias a los 2 primeros enemigos del frente por las 2 siguientes cartas en la baraja. Usar la habilidad cuenta como `Escapar`.',
                'icono' => '/storage/habilidades/GritoGuerra.webp'
            ],
            [
                'nombre' => 'Vitalismo',
                'descripcion' => 'Obtienes más vida base y la capacidad de curarte 5 de vida cada ronda.',
                'icono' => '/storage/habilidades/Vitalismo.webp'
            ],
            [
                'nombre' => 'Abrojos',
                'descripcion' => 'Una vez por turno, puedes bajar el valor en 5 a las dos últimas cartas del frente.',
                'icono' => '/storage/habilidades/Abrojos.webp'
            ],
            [
                'nombre' => 'Visión arcana',
                'descripcion' => 'Permite ver el palo de las 4 siguientes cartas siempre que quieras y barajar el mazo 1 vez por ronda.',
                'icono' => '/storage/habilidades/VisionArcana.webp'
            ],
        ];

        foreach ($habilidadesData as $data) {
            ModelHabilidad::factory()->create([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'],
                'icono' => config('app.backend_url') . $data['icono'],
            ]);
        }
    }
}
