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
                // 1. Verificamos si es una carta especial
                $esEspecial = $num > 10 && in_array($palo, ['Diamante', 'Corazon']);
                $efectos = null;

                // 2. Si es especial, buscamos su efecto único
                if ($esEspecial) {
                    $idCarta = "{$num}-{$palo}";
                    $arrayEfectos = match ($idCarta) {
                        '11-Corazon' => [['name' => 'restore_ability', 'value' => true], ['name' => 'heal', 'value' => 0]],
                        '12-Corazon' => [['name' => 'progresive_heal', 'value' => 5], ['name'=>'progresive_heal_turns', 'value'=>3]],
                        '13-Corazon' => [['name' => 'dmg_reduction', 'value' => 10]],
                        '14-Corazon' => [['name' => 'heal_roulete', 'value' => true]],

                        '11-Diamante' => [['name' => 'invincibility_turns', 'value' => 1]],
                        '12-Diamante' => [['name' => 'revive', 'value' => true], ['name' => 'revive_health', 'value' => 1]],
                        '13-Diamante' => [['name' => 'health_steal', 'value' => 1]],
                        '14-Diamante' => [['name' => 'weapon_dmg', 'value' => 14]],

                        default => [] // Por si acaso no coincide ninguna
                    };

                    // Lo codificamos tal y como lo necesitas para tu base de datos
                    $efectos = json_encode($arrayEfectos);
                }

                // 3. Un único create para todo
                ModelCarta::factory()->create([
                    'palo' => $palo,
                    'valor' => $num,
                    'imagen' => config('app.backend_url') . "/storage/cartas/{$nombre}{$palo}.webp",
                    'activa' => true,
                    'especial' => $esEspecial,
                    'efectos' => $efectos,
                ]);
            }
        }
    }
}
