<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Carta extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'cartas';

    protected $fillable = [
        'palo',
        'valor',
        'imagen'
    ];
}
