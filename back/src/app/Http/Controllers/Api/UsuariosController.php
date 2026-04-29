<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuarios;
use App\Http\Requests\Usuarios\StoreUsuarioRequest;
use App\Http\Requests\Usuarios\UpdateUsuarioRequest;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Hash;

class UsuariosController extends Controller
{
    public function index()
    {
        $usuarios = Usuarios::select('id', 'nick', 'email', 'avatar','color','created_at')->get();   
        $usuarios = $usuarios->load(['comentarios', 'tiene_jugadas']);
        return response()->json(['usuario' => $usuarios]);
    }

    public function store(StoreUsuarioRequest $request)
    {
        $archivoPath = null;

        if ($request->hasFile('avatar')) {
            $archivoPath = $request->file('avatar')->store('usuarios');
        }
        if (!str_contains($archivoPath, 'googleusercontent.com')) {
            $archivoPath = Storage::url($archivoPath);
        }
        $usuario = Usuarios::create([
            'nick' => $request->nick,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $archivoPath,
            'color' => $request->color
        ]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            "usuario" => $usuario,
            "access_token" => $token,
        ], 201);
    }

    public function show(string $nick)
    {
        $usuario = Usuarios::select('id', 'nick', 'email', 'es_admin', 'avatar','color','created_at')->where('nick', '=', $nick)->get();
        $usuario = $usuario->load(['comentarios', 'tiene_jugadas']);
        return response()->json(['usuario' => $usuario]);
    }

    public function update(UpdateUsuarioRequest $request, $nick)
    {
        $usuario = Usuarios::where('nick', $nick)->firstOrFail();
        
        $data = $request->validated();
    
        
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $archivoPath = false;
        if(isset($data["avatar"])){
            if ($request->hasFile('avatar')) {
                $archivoPath = $request->file('avatar')->store('usuarios');
            }
            if (!str_contains($archivoPath, 'googleusercontent.com')) {
                $archivoPath = Storage::url($archivoPath);
            }
        }

        $usuario->update(
            ['password' => $request->password != "" ? $data['password'] : $usuario->password,
            'avatar' => $archivoPath ?: $usuario->avatar,
            'color' => $data['color']]
        );

        return response()->json($usuario);
    }

    public function destroy($id)
    {
        Usuarios::findOrFail($id)->delete();

        return response()->json(['message' => 'Usuario eliminado'], 201);
    }
}
