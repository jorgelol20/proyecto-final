<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuarios;
use App\Http\Requests\Usuarios\StoreUsuarioRequest;
use App\Http\Requests\Usuarios\UpdateUsuarioRequest;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class UsuariosController extends Controller
{
    public function index()
    {
        return response()->json(Usuarios::all());
    }
    
    public function store(StoreUsuarioRequest $request)
    {
        $archivoPath = null;
        // En tu Controlador
        if ($request->hasFile('avatar')) {
            $archivoPath = $request->file('avatar')->store('usuarios');
            //$archivoPath = Storage::url($archivoPath);
        }
        return response()->json(['url'=>$archivoPath, 'avatar'=>$request->file('avatar')->getRealPath()]);

        $usuario = Usuarios::create([
            'nick'     => $request->nick,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'avatar'   => $archivoPath, 
        ]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            "datos" => $usuario,
            "access_token" => $token,
            "token_type" => "Bearer"
        ], 201);
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
