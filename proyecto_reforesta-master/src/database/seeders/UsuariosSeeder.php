<?php

namespace Database\Seeders;


use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Usuarios;
use App\Models\Eventos;
class UsuariosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Usuarios::factory(5)->create();

        Usuarios::factory()->has(Eventos::factory()->count(3), 'hospeda')->create();

        Usuarios::factory()->has(Eventos::factory()->count(3), 'usuariosEventos')->create();


    }
}
