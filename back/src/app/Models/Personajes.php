<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personajes extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;
   
    public $timestamps = true;
    protected $table = 'usuarios';
    protected $fillable = ['nombre','descripcion','imagen'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'efectos' => 'array',
        ];
    }

    //Partidas en las que es usado el modificador
    public function es_jugado()
    {
        return $this->belongsToMany(Partidas::class);
    }

}

