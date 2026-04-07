<?php

use App\Models\Usuarios;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsuariosController as UsuarioApiController;
use App\Http\Controllers\Api\PartidasController as PartidasApiController;
use App\Http\Controllers\Api\ModificadoresController as ModificadoresApiController;
use App\Http\Controllers\Api\PersonajesController as PersonajesApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', function (Request $request){
    $user = Usuarios::where('email',$request->input('email')->first());
    return $user;
});

//Controlador Usuarios.
Route::apiResource('/usuarios',UsuarioApiController::class)->names('api.usuarios');

//Controlador Partidas.
Route::apiResource('/eventos',PartidasApiController::class)->names('api.eventos');

//Controlador Modificadores.
Route::apiResource('/eventos',ModificadoresApiController::class)->names('api.eventos');

//Controlador Personajes.
Route::apiResource('/eventos',PersonajesApiController::class)->names('api.eventos');