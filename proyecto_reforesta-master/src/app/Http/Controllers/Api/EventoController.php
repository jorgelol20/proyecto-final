<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApiEventosPost;
use App\Http\Requests\EventosPost;
use App\Models\Especies;
use App\Models\Eventos;
use App\Models\Usuarios;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Http\Requests\ApiEventosUpdate;

class EventoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eventos = Eventos::select('id','nombre', 'tipo_evento', 'tipo_terreno', 'ubicacion', 'fecha', 'descripcion', 'imagen', 'pdf', 'anfitrion_id', 'estado_evento')->get();

        $eventos = $eventos->load(['anfitrion','especies']);
        return response()->json($eventos,202);
    }

    
    /**
     * Store a newly created resource in storage.
     */
    public function store(ApiEventosPost $request)
    {
        
        $usuario = Usuarios::findOrFail($request->anfitrion_id);
        $especie = Especies::findOrFail($request->id_especie);
        $evento = Eventos::create([
            'nombre' => $request->nombre,
            'tipo_evento' => $request->tipo_evento,
            'tipo_terreno' => $request->tipo_terreno,
            'ubicacion' => $request->ubicacion,
            'fecha' => $request->fecha,
            'descripcion' => $request->descripcion,
            'imagen' => $request->imagen,
            'pdf' => $request->pdf,
            'anfitrion_id' => $usuario->id
        ]);
       if ($request->especie != "") {
            $evento->especies()->syncWithoutDetaching([$request->especie]);
        }
        return response()->json($evento, 202);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $evento = Eventos::select('id','nombre', 'tipo_evento', 'tipo_terreno', 'ubicacion', 'fecha', 'descripcion', 'imagen', 'pdf', 'anfitrion_id', 'estado_evento')->where('id', '=' , $id)->get();

        $evento = $evento->load(['anfitrion','especies']);
        return response()->json($evento, 202);
    }

   
    /**
     * Update the specified resource in storage.
     */
    public function update(ApiEventosUpdate $request, string $id)
    {
        $especie = Especies::findOrFail($request->especie_id);
        $evento = Eventos::findOrFail($id);
         $evento->update([
            'fecha' => $request->fecha > new DateTime('today') ? $request->fecha : $evento->fecha,
            'descripcion' => $request->descripcion != "" ? $request->descripcion : $evento->descripcion,
            'imagen' => $request->imagen ?: $evento->imagen,
            'pdf' => $request->pdf ?: $evento->pdf
        ]);

         if ($especie != "") {
            $evento = Eventos::findOrFail($id)->load(['especies']);
            if (count($evento->especies) > 0) {
                $evento->especies()->detach($evento->especies[0]->id);
            }
            $evento->especies()->syncWithoutDetaching([$request->especie_id]);
        } else {
            $evento = Eventos::findOrFail($id)->load(['especies']);
            if (count($evento->especies) > 0) {
                $evento->especies()->detach($evento->especies[0]->id);
            }

        }

         return response()->json($evento, 202);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $evento = Eventos::findOrFail($id);
        $evento->delete();

        return response()->json($evento,201);
    }
}
