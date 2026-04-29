<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Personajes as ModelPersonajes;

class Personajes extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $personajesData = [
            [
                'id' => 1,
                'nombre' => 'Guerrero',
                'descripcion' => 'Nació por su madre, morirá luchando en batalla. Infunde tanto terror en sus enemigos que les hace huir despavoridos.',
                'habilidad_id' => 1
            ],
            [
                'id' => 2,
                'nombre' => 'Paladin',
                'descripcion' => 'Acogido en un convento cuando era niño y guiado por la fe, ahora es todo un adulto. Su voluntad hacia Dios es tan fuerte que, en batalla, le proporciona vitalidad suficiente para defender a sus compañeros',
                'habilidad_id' => 2
            ],
            [
                'id' => 3,
                'nombre' => 'Elfo',
                'descripcion' => 'Criado en la espesura salvaje y conocedor de cada secreto del bosque, se ha convertido en un maestro de la guerra de guerrillas y el uso de trampas para debilitar a sus enemigos.',
                'habilidad_id' => 3
            ],
            [
                'id' => 4,
                'nombre' => 'Mago',
                'descripcion' => 'Estudioso de los grimorios antiguos desde su juventud y consagrado a descifrar los misterios de la magia arcana permitiendole anticiparse a los eventos futuros.',
                'habilidad_id' => 4
            ],
        ];

        foreach ($personajesData as $data) {
            ModelPersonajes::factory()
                ->create([
                    'nombre' => $data['nombre'],
                    'descripcion' => $data['descripcion'],
                    'imagen' => env('APP_URL') . "/storage/personajes/{$data['nombre']}.webp",
                    'activo' => true,
                    'habilidad_id' => $data['habilidad_id'],
                ]);
        }
    }
}
