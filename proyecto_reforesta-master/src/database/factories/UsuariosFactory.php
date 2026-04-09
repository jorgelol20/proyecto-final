<?php

namespace Database\Factories;
use App\Models\Usuarios;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Usuarios>
 */
class UsuariosFactory extends Factory
{
    protected $model= Usuarios::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
         
    public function definition(): array
    {
        return [
            'nick'=>$this->faker->unique()->userName,
            'nombre'=>$this->faker->firstName,
            'apellidos'=>$this->faker->lastName,
            'password'=>$this->faker->password(4,5),
            'email'=>$this->faker->unique->email,
            'karma'=>$this->faker->numberBetween(2,10),
            'avatar'=>$this->faker->imageUrl,
            
        ];
    }
}
