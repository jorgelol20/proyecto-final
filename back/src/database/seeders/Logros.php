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
                'nombre' => '',
                'descripcion' => '',
                'icono' => '/storage/logros/'
            ],
            [
                'nombre' => '',
                'descripcion' => '',
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
