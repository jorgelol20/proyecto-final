<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carta;
use Illuminate\Http\Request;

class CartaController extends Controller
{
    public function index()
    {
        return response()->json(Carta::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'palo' => 'required|string|max:50',
            'valor' => 'required|integer',
            'imagen' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('cartas', 'public');
            $data['imagen'] = $path;
        }

        $carta = Carta::create($data);

        return response()->json($carta, 201);
    }

    public function show($id)
    {
        return response()->json(Carta::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $carta = Carta::findOrFail($id);

        $data = $request->validate([
            'palo' => 'sometimes|string|max:50',
            'valor' => 'sometimes|integer',
            'imagen' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('cartas', 'public');
            $data['imagen'] = $path;
        }

        $carta->update($data);

        return response()->json($carta);
    }

    public function destroy($id)
    {
        Carta::findOrFail($id)->delete();
        return response()->json(['message' => 'Carta eliminada']);
    }
}
