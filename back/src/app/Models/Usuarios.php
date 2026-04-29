<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Usuarios extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;
   
    public $timestamps = true;
    protected $table = 'usuarios';
    protected $fillable = ['nick','es_admin','password','email','avatar','color'];

     /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'es_admin' => 'boolean',
            'avatar' => 'string',
            'color' => 'string',
        ];
    }

    /**
     * Summary of comentarios
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Partidas, Usuarios, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function comentarios(){
        return $this->belongsToMany(
            Partidas::class,
            "comentarios_usuario_partida",
            'usuario_id',
            'partida_id'
        )->withPivot('comentario','created_at', 'updated_at');
    }

    /**
     * Summary of tiene
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Partidas, Usuarios>
     */
    public function tiene_jugadas(){
        return $this->hasMany(Partidas::class, 'usuario_id');
    }
}
