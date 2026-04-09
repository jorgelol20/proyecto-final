<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partidas;
use Illuminate\Http\Request;

class PartidasController extends Controller
{
    public function index()
    {
        return response()->json(Partidas::all());
    }

    public function store(Request $request)
    {
        $partida = Partidas::create($request->all());
        return response()->json($partida, 201);
    }

    public function show($id)
    {
        return response()->json(Partidas::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $partida = Partidas::findOrFail($id);
        $partida->update($request->all());

        return response()->json($partida);
    }

    public function destroy($id)
    {
        Partidas::findOrFail($id)->delete();
        return response()->json(['message' => 'Partida eliminada']);
    }
}
