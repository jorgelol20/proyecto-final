<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UsuariosPost;
use App\Models\Usuarios;
use Illuminate\Http\Request;
use function Laravel\Prompts\select;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usuarios = Usuarios::select('id','nick','nombre','apellidos','email','karma','avatar')->get();
        $usuarios = $usuarios->load(['hospeda','usuariosEventos']);

        return response()->json($usuarios,202);
    }

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(UsuariosPost $request)
    {

        $usuario = Usuarios::create([
            'nick' => $request->nick,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'password' => bcrypt($request->password),
            'email' => $request->email,
            'avatar' => $request->avatar
        ]);

        return response()->json($usuario, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $usuario = Usuarios::select('id','nick','nombre','apellidos','email','karma','avatar')->where('id', '=',$id)->get();
        $usuario = $usuario->load(['hospeda','usuariosEventos']);

        return response()->json($usuario,202);
    }

    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $usuario = Usuarios::findOrFail($id);
        
        $usuario->update([
            'nombre' => $request->nombre != "" ? $request->nombre : $usuario->nombre,
            'apellidos' => $request->apellidos != "" ? $request->apellidos : $usuario->apellidos,
            'avatar' => $request->avatar ?: $usuario->avatar
        ]);

        return response()->json($usuario, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $usuario = Usuarios::findOrFail($id);

        $usuario->delete();
        
        return response()->json($usuario, 201);
    }
}
