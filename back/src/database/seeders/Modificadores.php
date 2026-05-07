<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Modificadores as ModelModificadores;

class Modificadores extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modificadores = [
            [
                'nombre' => 'Cofre de Bronce',
                'descripcion' => 'Abre rápidamente el cofre y obtén un arma mediocre para el inicio de la siguiente ronda.',
                'imagen' => "/storage/modificadores/CofreBronce.webp",
                'nivel' => 1,
                'efectos' => json_encode(['name' => 'chest_rewards', 'value' => [2, 3, 4]])
            ],
            [
                'nombre' => 'Cofre de Plata',
                'descripcion' => 'Abre rápidamente el cofre y obtén un arma normal para el inicio de la siguiente ronda.',
                'imagen' => "/storage/modificadores/CofrePlata.webp",
                'nivel' => 2,
                'efectos' => json_encode(['name' => 'chest_rewards', 'value' => [5, 6, 7]])
            ],
            [
                'nombre' => 'Cofre de Oro',
                'descripcion' => 'Abre rápidamente el cofre y obtén un arma buena para el inicio de la siguiente ronda.',
                'imagen' => "/storage/modificadores/CofreOro.webp",
                'nivel' => 3,
                'efectos' => json_encode(['name' => 'chest_rewards', 'value' => [8, 9, 10]])
            ],
        ];

        foreach ($modificadores as $data) {
            ModelModificadores::factory()->create([
                'nombre' => $data['nombre'],
                'descripcion' => $data['descripcion'],
                'imagen' => env('APP_URL') ? env('APP_URL') : 'https://api.scoundrels-quest.com'. $data['imagen'],
                'nivel' => $data['nivel'],
                'efectos' => $data['efectos'],
            ]);
        }
    }
}
