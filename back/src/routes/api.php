<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

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


//Controlador Usuarios.
Route::apiResource('/usuarios',UsuarioApiController::class)->names('api.usuarios');

//Controlador Partidas.
Route::apiResource('/partidas', PartidasApiController::class)->names('api.partidas');

//Controlador Modificadores.
Route::apiResource('/modificadores', ModificadoresApiController::class)->names('api.modificadores');

//Controlador Personajes.
Route::apiResource('/personajes', PersonajesApiController::class)->names('api.personajes');
