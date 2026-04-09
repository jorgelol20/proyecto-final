<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Summary of Especies
 */
class Especies extends Model
{   
    use HasFactory;
    /**
     * Summary of timestamps
     * @var 
     */
    public $timestamps = false;
    /**
     * Summary of table
     * @var string
     */
    protected $table = 'especies';
    /**
     * Summary of fillable
     * @var array
     */
    protected $fillable = ['nombre','clima','region','imagen','beneficios','descripcion','tiempo_crecimiento'];

    /**
     * Summary of eventos
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Eventos, Especies, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function eventos(){
        return $this->belongsToMany(Eventos::class, 'eventos_especies', 'evento_id','especie_id');
    }
}
