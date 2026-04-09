<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuarios;
use App\Http\Requests\Usuarios\StoreUsuarioRequest;
use App\Http\Requests\Usuarios\UpdateUsuarioRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuariosController extends Controller
{
    public function index()
    {
        return response()->json(Usuarios::all());
    }

    public function store(StoreUsuarioRequest $request)
    {
        $data = $request->validated();

        $data['password'] = Hash::make($data['password']);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('usuarios', 'public');
            $data['avatar'] = $path;
        }

        $usuario = Usuarios::create($data);

        return response()->json($usuario, 201);
    }

    public function show($id)
    {
        return response()->json(Usuarios::findOrFail($id));
    }

    public function update(UpdateUsuarioRequest $request, $id)
    {
        $usuario = Usuarios::findOrFail($id);

        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('usuarios', 'public');
            $data['avatar'] = $path;
        }

        $usuario->update($data);

        return response()->json($usuario);
    }

    public function destroy($id)
    {
        Usuarios::findOrFail($id)->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }
}
