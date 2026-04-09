<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Especies>
 */
class EspeciesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->text(50),
            'region' => $this->faker->country,
            'imagen' => $this->faker->imageUrl,
            'beneficios' => $this->faker->text(100),
            'descripcion' => $this->faker->text(50),
            'tiempo_crecimiento' => $this->faker->numberBetween(0,50),
        ];
    }
}
