<?php

namespace Database\Factories;
use App\Models\Eventos;
use App\Models\Usuarios;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Eventos>
 */
class EventosFactory extends Factory
{
    protected $model= Eventos::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
            
    public function definition(): array
    {
        return [
            'nombre'=>$this->faker->streetName,
            'tipo_evento'=>$this->faker->name,
            'tipo_terreno'=>$this->faker->domainName,
            'ubicacion'=>$this->faker->address,
            'fecha'=>$this->faker->date(),
            'anfitrion_id'=>Usuarios::factory(),
            'descripcion'=>$this->faker->text(300),
            'imagen'=>$this->faker->imageUrl,
        ];
    }
}
