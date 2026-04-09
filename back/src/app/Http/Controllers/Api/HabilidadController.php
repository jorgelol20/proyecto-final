<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Habilidad;
use Illuminate\Http\Request;

class HabilidadController extends Controller
{
    public function index()
    {
        return response()->json(Habilidad::all());
    }

    public function store(Request $request)
    {
        $habilidad = Habilidad::create($request->all());
        return response()->json($habilidad, 201);
    }

    public function show($id)
    {
        return response()->json(Habilidad::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $habilidad = Habilidad::findOrFail($id);
        $habilidad->update($request->all());

        return response()->json($habilidad);
    }

    public function destroy($id)
    {
        Habilidad::findOrFail($id)->delete();
        return response()->json(['message' => 'Habilidad eliminada']);
    }
}
