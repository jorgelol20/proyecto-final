<?php

namespace Database\Seeders;

use Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Usuarios as ModelUsuarios;

class Usuarios extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ModelUsuarios::factory()->create([
            'nick' => 'admin',
            'email' => 'admin@scoundrel.com',
            'password' => Hash::make('HZnQ_1705'),
            'es_admin' => true,
            'avatar' => null,
        ]);
    }
}
