<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logros extends Model
{
    protected $table = 'logros';

    public $timestamps = false;

    protected $fillable = ['nombre','descripcion','icono'];

    public function obtenido_por()
    {
        return $this->belongsToMany(Usuarios::class, "usuarios_logros", 'logro_id', 'usuario_id')->withPivot('id', 'created_at', 'updated_at');
    }
}
