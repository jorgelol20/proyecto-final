<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Logros as ModelLogros;

class Logros extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $logrosData = [
            [
                'nombre' => 'Bienvenido a Scoundrel',
                'descripcion' => 'Juega tu primera partida.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'La primera de muchas...',
                'descripcion' => 'Pierde tu primera partida.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => '¿De verdad lo lograste?',
                'descripcion' => 'Gana tu primera partida.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'Apostador nato',
                'descripcion' => 'Gana tu primera partida con `El Apostador`.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'Archimago',
                'descripcion' => 'Gana tu primera partida con `El Mago`.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'Alto Elfo',
                'descripcion' => 'Gana tu primera partida con `El Elfo`.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'Inquisidor',
                'descripcion' => 'Gana tu primera partida con `El Paladín`.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'Gran Guerrero',
                'descripcion' => 'Gana tu primera partida con `El Guerrero`.',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'Textura gelatinosa',
                'descripcion' => 'Consume el Cubo de Slime',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => 'Jugador supremo',
                'descripcion' => 'Llega a la ronda 20.',
                'icono' => '/storage/logros/'
            ],
        ];

        foreach ($logrosData as $data) {
            ModelLogros::updateOrCreate(
                ['nombre' => $data['nombre']],
                [
                    'descripcion' => $data['descripcion'],
                    'icono' => config('app.backend_url') . $data['icono'],
                ]
            );
        }
    }
}
