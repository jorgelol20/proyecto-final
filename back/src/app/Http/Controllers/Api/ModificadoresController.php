<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Modificadores;
use Illuminate\Http\Request;

class ModificadoresController extends Controller
{
    public function index()
    {
        return response()->json(Modificadores::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:300',
            'imagen' => 'nullable|image|max:2048',
            'efectos' => 'required|array'
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('modificadores', 'public');
            $data['imagen'] = $path;
        }

        $modificador = Modificadores::create($data);
        return response()->json($modificador, 201);
    }

    public function show($id)
    {
        return response()->json(Modificadores::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $modificador = Modificadores::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'descripcion' => 'sometimes|string|max:300',
            'imagen' => 'nullable|image|max:2048',
            'efectos' => 'sometimes|array'
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('modificadores', 'public');
            $data['imagen'] = $path;
        }

        $modificador->update($data);

        return response()->json($modificador);
    }

    public function destroy($id)
    {
        Modificadores::findOrFail($id)->delete();
        return response()->json(['message' => 'Modificador eliminado']);
    }
}
