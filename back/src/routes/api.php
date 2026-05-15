<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsuariosController as UsuarioApiController;
use App\Http\Controllers\Api\PartidasController as PartidasApiController;
use App\Http\Controllers\Api\ModificadoresController as ModificadoresApiController;
use App\Http\Controllers\Api\PersonajesController as PersonajesApiController;

#Registro y logeo
Route::post('/signup', [UsuarioApiController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [AuthController::class, 'me']);
    Route::post('/usuarios/ping', [UsuarioApiController::class, 'ping']);
    Route::get('/jugadores-activos', [UsuarioApiController::class, 'activeCount']);
});

//Controlador Usuarios.
Route::apiResource('/usuarios', UsuarioApiController::class)->names('api.usuarios');
Route::get('/usuarios/search/{search}', [UsuarioApiController::class, 'search'])->name('api.usuarios.search');
Route::post('/usuarios/comentario/', [UsuarioApiController::class, 'storeComentario'])->name('api.usuarios.comentario');
Route::delete('/usuarios/comentario/{id}', [UsuarioApiController::class, 'destroyComentario'])->name('api.usuarios.comentario.eliminar');
Route::put('/usuarios/comentario/{id}', [UsuarioApiController::class, 'updateComentario'])->name('api.usuarios.comentario.actualizar');

//Rankings
Route::get('/ranking-victorias', [UsuarioApiController::class, 'ranking_victorias'])->name('api.usuarios.ranking-victorias');
Route::get('/ranking-rondas', [UsuarioApiController::class, 'ranking_rondas'])->name('api.usuarios.ranking-rondas');
Route::get('/ranking-partidas', [PartidasApiController::class, 'ranking_partidas'])->name('api.partidas.ranking-partidas');

//Controlador Partidas.
Route::apiResource('/partidas', PartidasApiController::class)->names('api.partidas');


//Controlador Modificadores.
Route::apiResource('/modificadores', ModificadoresApiController::class)->names('api.modificadores');

//Controlador Personajes.
Route::apiResource('/personajes', PersonajesApiController::class)->names('api.personajes');

//Controlador Cartas.
Route::apiResource('/cartas', CartaController::class)->names('api.cartas');


//Inicio de sesión con Google
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

//Inicio de sesión con X
Route::middleware(['web'])->group(function () {
    Route::get('/auth/x/redirect', [AuthController::class, 'redirectToX']);
    Route::get('/auth/x/callback', [AuthController::class, 'handleXCallback']);
});