<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * Summary of Eventos
 */
class Eventos extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'eventos';
    protected $fillable = ['nombre', 'tipo_evento', 'tipo_terreno', 'ubicacion', 'fecha', 'descripcion', 'imagen', 'pdf', 'anfitrion_id', 'estado_evento'];
    protected $casts = [
        'fecha' => 'date:Y-m-d',
    ];
    /**
     * Summary of participantes
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Usuarios, Eventos, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function participantes()
    {
        return $this->belongsToMany(Usuarios::class, 'usuarios_eventos');
    }

    /**
     * Summary of anfitrion
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Usuarios, Eventos>
     */
    public function anfitrion()
    {
        return $this->belongsTo(Usuarios::class);
    }

    /**
     * Summary of especies
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Especies, Eventos, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function especies()
    {
        return $this->belongsToMany(Especies::class, 'eventos_especies', 'evento_id', 'especie_id');
    }
}
