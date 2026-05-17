<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partidas;
use App\Models\Usuarios;
use App\Http\Requests\Usuarios\StoreUsuarioRequest;
use App\Http\Requests\Usuarios\UpdateUsuarioRequest;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Hash;

class UsuariosController extends Controller
{
    public function index()
    {
        $usuarios = Usuarios::select('id', 'nick', 'email', 'avatar', 'color', 'created_at', 'ultima_vez_visto')
            ->withCount([
                'tiene_jugadas as total_victorias' => function ($query) {
                    $query->where('victoria', true);
                },
                'tiene_jugadas as total_derrotas' => function ($query) {
                    $query->where('victoria', false);
                }
            ])
            ->get();
        $usuarios = $usuarios->load(['comentarios', 'tiene_jugadas.modificadores']);
        return response()->json(['usuario' => $usuarios]);
    }

    public function store(StoreUsuarioRequest $request)
    {
        $archivoPath = null;

        if ($request->hasFile('avatar')) {
            $archivoPath = $request->file('avatar')->store('usuarios');

            if (!str_contains($archivoPath, 'googleusercontent.com')) {
                $archivoPath = Storage::url($archivoPath);
            }
        }


        if ($archivoPath == null) {
            $archivoPath = config('app.backend_url') . "/storage/personajes/Guerrero.webp";
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
        $usuario = Usuarios::select('id', 'nick', 'email', 'es_admin', 'avatar', 'color', 'created_at', 'ultima_vez_visto')->where('nick', '=', $nick)->get();
        $usuario = $usuario->load(['comentarios', 'tiene_jugadas.modificadores']);
        return response()->json(['usuario' => $usuario], 201);
    }

    public function search(string $search)
    {
        $usuarios = Usuarios::select('id', 'nick', 'email', 'es_admin', 'avatar', 'color', 'created_at','ultima_vez_visto')->where('nick', 'LIKE', '%' . $search . '%')->limit(3)->get();
        return response()->json(['usuarios' => $usuarios], 201);
    }

    public function update(UpdateUsuarioRequest $request, $nick)
    {
        $usuario = Usuarios::where('nick', $nick)->firstOrFail();

        $data = $request->validated();


        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $archivoPath = false;
        if (isset($data["avatar"])) {
            if ($request->hasFile('avatar')) {
                $archivoPath = $request->file('avatar')->store('usuarios');
            }
            if (!str_contains($archivoPath, 'googleusercontent.com')) {
                $archivoPath = Storage::url($archivoPath);
            }
        }

        $usuario->update(
            [
                'password' => $request->password != "" ? $data['password'] : $usuario->password,
                'avatar' => $archivoPath ?: $usuario->avatar,
                'color' => $data['color']
            ]
        );

        return response()->json($usuario);
    }

    public function borrarFotoPerfil(Request $request, $nick)
    {
        if (!$request->user()->es_admin) {
            return response()->json([
                'message' => 'No tienes los permisos necesarios para acceder a este recurso.'
            ], 403);
        }
        $usuario = Usuarios::where('nick', $nick)->firstOrFail();
        $archivoPath = config('app.backend_url') . "/storage/personajes/Guerrero.webp";
        $usuario->update(
            [
                'avatar' => $archivoPath
            ]
        );

    }

    public function destroy(Request $request,$id)
    {

        if (!$request->user()->es_admin) {
            return response()->json([
                'message' => 'No tienes los permisos necesarios para acceder a este recurso.'
            ], 403);
        }
        Usuarios::findOrFail($id)->delete();

        return response()->json(['message' => 'Usuario eliminado'], 201);
    }


    public function storeComentario(Request $request)
    {
        $partida = Partidas::findOrFail($request->partida_id);
        $usuarioId = $request->user()->id;
        $partida->comentarios()->attach($usuarioId, [
            'comentario' => $request->comentario,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Comentario añadido con éxito']);
    }
    public function updateComentario(Request $request)
    {
        if ($request->user()->id !== $request->usuario_id) {
            return response()->json([
                'message' => 'No tienes los permisos necesarios para acceder a este recurso.'
            ], 403);
        }
        $partida = Partidas::findOrFail($request->partida_id);
        $usuarioId = $request->usuario_id;

        // updateExistingPivot busca por la FK del usuario y actualiza los campos extra
        $partida->comentarios()->updateExistingPivot($usuarioId, [
            'comentario' => $request->comentario,
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Comentario actualizado con éxito']);
    }
    public function destroyComentario(Request $request, $id)
    {
        if (!$request->user()->es_admin) {
            return response()->json([
                'message' => 'No tienes los permisos necesarios para acceder a este recurso.'
            ], 403);
        }
        $existe = DB::table('comentarios_usuario_partida')->where('id', $id)->first();
        if (!$existe) {
            return response()->json(['message' => 'El comentario no existe'], 404);
        }
        DB::table('comentarios_usuario_partida')->where('id', $id)->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Comentario eliminado correctamente'
        ]);
    }
    public function ranking_victorias()
    {
        $usuarios = Usuarios::select('id', 'nick', 'email', 'avatar', 'color', 'created_at', 'es_admin','ultima_vez_visto')
            ->withCount([
                'tiene_jugadas as total_victorias' => function ($query) {
                    $query->where('victoria', true);
                },
                'tiene_jugadas as total_derrotas' => function ($query) {
                    $query->where('victoria', false);
                },
                'tiene_jugadas'
            ])
            ->having('total_victorias', '>', 0)
            ->orderBy('total_victorias', 'desc')
            ->get();
        return response()->json(['usuarios' => $usuarios]);
    }
    public function ranking_rondas()
    {
        $usuarios = Usuarios::select('id', 'nick', 'email', 'avatar', 'color', 'created_at', 'es_admin', 'ultima_vez_visto')
            ->withMax('tiene_jugadas as record_rondas', 'rondas')
            ->withCount([
                'tiene_jugadas as total_partidas'
            ])
            ->having('total_partidas', '>', 0)
            ->orderBy('record_rondas', 'desc')
            ->get();

        return response()->json(['usuarios' => $usuarios]);
    }

    public function ping(Request $request)
    {
        $user = $request->user();

        $user->ultima_vez_visto = now();
        $user->save();

        return response()->json([
            'status' => 'alive',
            'fecha_guardada' => $user->ultima_vez_visto
        ]);
    }

    public function cuentaActiva()
    {
        $umbral = now()->subSeconds(60)->toDateTimeString();
        $conteo = Usuarios::where('ultima_vez_visto', '>=', $umbral)->count();
        return response()->json(['active_users' => $conteo]);
    }
}

