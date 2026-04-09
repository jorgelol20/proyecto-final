<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partidas;
use App\Http\Requests\Partidas\StorePartidaRequest;
use App\Http\Requests\Partidas\UpdatePartidaRequest;
use Illuminate\Http\Request;

class PartidasController extends Controller
{
    public function index()
    {
        return response()->json(Partidas::all());
    }

    public function store(StorePartidaRequest $request)
    {
        $partida = Partidas::create($request->validated());
        return response()->json($partida, 201);
    }

    public function show($id)
    {
        return response()->json(Partidas::findOrFail($id));
    }

    public function update(UpdatePartidaRequest $request, $id)
    {
        $partida = Partidas::findOrFail($id);
        $partida->update($request->validated());

        return response()->json($partida);
    }

    public function destroy($id)
    {
        Partidas::findOrFail($id)->delete();
        return response()->json(['message' => 'Partida eliminada']);
    }
}
