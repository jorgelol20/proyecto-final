<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Carta as ModelCarta;

class Cartas extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $palos = ['Pica', 'Corazon', 'Diamante', 'Trebol'];
        $valores = [
            '2' => 'Dos',
            '3' => 'Tres',
            '4' => 'Cuatro',
            '5' => 'Cinco',
            '6' => 'Seis',
            '7' => 'Siete',
            '8' => 'Ocho',
            '9' => 'Nueve',
            '10' => 'Diez',
            '11' => 'Sota',
            '12' => 'Reina',
            '13' => 'Rey',
            '14' => 'As'
        ];

        foreach ($palos as $palo) {
            foreach ($valores as $num => $nombre) {
                ModelCarta::factory()->create([
                    'palo' => $palo,
                    'valor' => $num,
                    'imagen' => config('app.backend_url')."/storage/cartas/{$nombre}{$palo}.webp",
                    'activa' => true
                ]);
            }
        }
    }
}
