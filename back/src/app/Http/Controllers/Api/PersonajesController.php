<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personajes;
use Illuminate\Http\Request;

class PersonajesController extends Controller
{
    public function index()
    {
        return response()->json(Personajes::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:30',
            'descripcion' => 'nullable|string|max:300',
            'imagen' => 'nullable|image|max:2048',
            'habilidad_id' => 'required|exists:habilidades,id'
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('personajes', 'public');
            $data['imagen'] = $path;
        }

        $personaje = Personajes::create($data);

        return response()->json($personaje, 201);
    }

    public function show($id)
    {
        return response()->json(Personajes::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $personaje = Personajes::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:30',
            'descripcion' => 'sometimes|string|max:300',
            'imagen' => 'nullable|image|max:2048',
            'habilidad_id' => 'sometimes|exists:habilidades,id'
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('personajes', 'public');
            $data['imagen'] = $path;
        }

        $personaje->update($data);

        return response()->json($personaje);
    }

    public function destroy($id)
    {
        Personajes::findOrFail($id)->delete();
        return response()->json(['message' => 'Personaje eliminado']);
    }
}
