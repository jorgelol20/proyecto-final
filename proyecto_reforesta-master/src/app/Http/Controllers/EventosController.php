<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventosPost;
use App\Http\Requests\UpdateEventos;
use App\Models\Especies;
use App\Models\Eventos;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class EventosController extends Controller
{
    /**
     * Método Index
     * 
     * Comprueba si el usuario está logeado. 
     * Si lo está, carga en los eventos los participantes de cada evento.
     * 
     * @return \Illuminate\Contracts\View\View
     */
    public function index()
    {
        if (auth()->check()) {
            $eventos = Eventos::all()->load(['anfitrion', 'participantes', 'especies']);
        } else {
            $eventos = Eventos::all()->load(['anfitrion', 'especies']);
        }

        return view('inicio', compact('eventos'));
    }

    /**
     * Método Create
     * 
     * Comprueba si el usuario está autenticado. 
     * Si lo está, lo reenvia al formulario de creación. 
     * En caso contrario, al de logeo.
     * 
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        if (!auth()->check()) {
            return view('usuarios.login');
        }
        $especies = Especies::all();
        return view('eventos.create', compact('especies'));
    }

    /**
     * Método Store
     * 
     * Este método llama a EventosPost para realizar las comprobaciones.
     * En caso de estar todas correctas, hace un guardado del nuevo evento en la BD y te reenvia a la vista 'show' del evento.
     * En caso contrario, devuelve automáticamente al formulario con los respectivos mensajes de error.
     * 
     * @param EventosPost $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(EventosPost $request)
    {
        $archivoPathImagen = null;
        $archivoPathPDF = null;

        if ($request->hasFile(key: 'imagen') && $request->imagen != null) {
            $archivoPathImagen = $request->file('imagen')->store('repositorio_ficheros');
            $archivoPathImagen = Storage::url($archivoPathImagen);
        }
        if ($request->hasFile(key: 'pdf') && $request->pdf != null) {
            $archivoPathPDF = $request->file('pdf')->store('repositorio_ficheros');
            $archivoPathPDF = Storage::url($archivoPathPDF);
        }



        $evento = Eventos::create([
            'nombre' => $request->nombre,
            'tipo_evento' => $request->tipo_evento,
            'tipo_terreno' => $request->tipo_terreno,
            'ubicacion' => $request->ubicacion,
            'fecha' => $request->fecha,
            'descripcion' => $request->descripcion,
            'imagen' => $archivoPathImagen,
            'pdf' => $archivoPathPDF,
            'anfitrion_id' => auth()->user()->id
        ]);
        if ($request->especie != "null") {
            $evento->especies()->syncWithoutDetaching([$request->especie]);
        }
        auth()->user()->increment('karma', 4);
        return redirect()->route('eventos.show', $evento->id);
    }

    /**
     * Método Show
     * 
     * Si el usuario está logeado, lo reenviará a la vista de detalles del evento.
     * En caso contrario, lo reenvía a la vista del formulario de logeo.
     * 
     * @param string $id
     * @return \Illuminate\Contracts\View\View
     */
    public function show(string $id)
    {
        $evento = Eventos::findOrFail($id)->load('anfitrion', 'participantes');
        if (!auth()->check()) {
            return view('usuarios.login');
        }

        return view('eventos.show', compact('evento'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $especies = Especies::all();
        $evento = Eventos::findOrFail($id)->load(['especies']);
        if (!auth()->check() && auth()->user()->id != $evento->id_anfitrion) {
            return redirect()->route('inicio');
        }

        return view('eventos.edit', compact('evento', 'especies'));
    }

    /**
     * Método Update
     * 
     * Utilizando UpdateEventos, realiza las comprobaciones del evento obteniendolo mediante el ID que se le pasa como parámetro.
     * Además, comprueba si el usuario logeado es el mismo que el anfitrión del evento que, en caso de no serlo, lo reenviará al inicio.
     * Además del método Update, se realizará la comprobación mediante una ternária de los campos para que en caso de estar vacíos, se queden los anteriores.
     * 
     * @param UpdateEventos $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateEventos $request, string $id)
    {
        $evento = Eventos::findOrFail($id);
        if (!auth()->check() && auth()->user()->id != $evento->id_anfitrion) {
            return redirect()->route('inicio');
        }
        $archivoPathImagen = null;
        $archivoPathPDF = null;

        if ($request->hasFile(key: 'imagen') && $request->imagen != null) {
            $archivoPathImagen = $request->file('imagen')->store('repositorio_ficheros');
            $archivoPathImagen = Storage::url($archivoPathImagen);
        }
        if ($request->hasFile(key: 'pdf') && $request->pdf != null) {
            $archivoPathPDF = $request->file('pdf')->store('repositorio_ficheros');
            $archivoPathPDF = Storage::url($archivoPathPDF);
        }
        $evento->update([
            'nombre' => $request->nombre != "" ? $request->nombre : $evento->nombre,
            'tipo_evento' => $request->tipo_evento != "" ? $request->tipo_evento : $evento->tipo_evento,
            'tipo_terreno' => $request->tipo_terreno != "" ? $request->tipo_terreno : $evento->tipo_terreno,
            'ubicacion' => $request->ubicacion != "" ? $request->ubicacion : $evento->ubicacion,
            'fecha' => $request->fecha > new DateTime('today') ? $request->fecha : $evento->fecha,
            'descripcion' => $request->descripcion != "" ? $request->descripcion : $evento->descripcion,
            'imagen' => $archivoPathImagen ?: $evento->imagen,
            'pdf' => $archivoPathPDF ?: $evento->pdf,
        ]);

        if ($request->especie != "null") {
            $evento = Eventos::findOrFail($id)->load(['especies']);
            if (count($evento->especies) > 0) {
                $evento->especies()->detach($evento->especies[0]->id);
            }
            $evento->especies()->syncWithoutDetaching([$request->especie]);
        } else {
            $evento = Eventos::findOrFail($id)->load(['especies']);
            if (count($evento->especies) > 0) {
                $evento->especies()->detach($evento->especies[0]->id);
            }

        }
        return redirect()->route('eventos.show', $evento->id);
    }

    /**
     * Método Destroy
     * 
     * Se comprueba que el usuario esté logeado y tenga el mismo ID que el anfitrión. En caso de no serlo, lo reenvia a inicio.
     * Si es el dueño del evento, se ejecuta la eliminación del evento.
     * 
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(string $id)
    {
        $evento = Eventos::findOrFail($id);
        if (!auth()->check() && auth()->user()->id != $evento->id_anfitrion) {
            return redirect()->route('inicio');
        }
        $evento->delete();

        return redirect()->route('eventos.index');
    }

    public function calendario()
    {
        $eventos = Eventos::all();
        return view('eventos.calendario', compact('eventos'));
    }


}
