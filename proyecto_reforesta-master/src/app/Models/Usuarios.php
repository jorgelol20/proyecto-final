<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Usuarios extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
   
    public $timestamps = false;
    protected $table = 'usuarios';
    protected $fillable = ['nick','nombre','apellidos','password','email','avatar'];

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
        ];
    }

    /**
     * Summary of usuariosEventos
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Eventos, Usuarios, \Illuminate\Database\Eloquent\Relations\Pivot>
     */
    public function usuariosEventos(){
        return $this->belongsToMany(Eventos::class, "usuarios_eventos");
    }

    /**
     * Summary of hospeda
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Eventos, Usuarios>
     */
    public function hospeda(){
        return $this->hasMany(Eventos::class, 'anfitrion_id');
    }
}
