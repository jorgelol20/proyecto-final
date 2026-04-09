<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Habilidad extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'habilidades';

    protected $fillable = [
        'nombre',
        'descripcion'
    ];

    // Relación: una habilidad tiene muchos personajes
    public function personajes()
    {
        return $this->hasMany(Personajes::class);
    }
}
