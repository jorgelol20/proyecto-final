<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Personajes extends Model
{
    use HasFactory;
   
    public $timestamps = false;
    protected $table = 'personajes';
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

    // Partidas en las que es usado el personaje
    public function es_jugado()
    {
        return $this->belongsToMany(Partidas::class);
    }

    // Relación: un personaje pertenece a una habilidad
    public function habilidad()
    {
        return $this->belongsTo(Habilidad::class);
    }

}
