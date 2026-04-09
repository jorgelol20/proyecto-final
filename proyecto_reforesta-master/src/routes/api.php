<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsuarioController as UsuarioApiController;
use App\Http\Controllers\Api\EventoController as EventoApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('/usuarios',UsuarioApiController::class)->names('api.usuarios');
Route::apiResource('/eventos',EventoApiController::class)->names('api.eventos');
