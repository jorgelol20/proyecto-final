<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUsuarios;
use App\Http\Requests\UsuariosPost;
use App\Models\Usuarios;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UsuariosController extends Controller
{
    /**
     * Método index de usuarios
     * 
     * En este método simplemente llamamos a la función select de todos los usuarios y enviamos la variable
     * a nuestra vista de inicio
     * 
     * @return \Illuminate\Contracts\View\View
     */
    public function index()
    {
        $usuarios = Usuarios::all();

        return view("usuarios.index", compact('usuarios'));
    }

    /**
     * Método crear usuarios
     * 
     * En este método devolvemos la vista con el formulario de creación de usuarios
     * 
     * @return \Illuminate\Contracts\View\View
     */
    public function create()
    {
        return view('usuarios.create');
    }

    /**
     * Método store usuarios
     * 
     * En este primero guardamos la imagen que nos pasa el usuarios, si es que lo hace,
     * Si accede por google guardamos la imagen que tenga de perfil allí
     * Posteriormente llamamos al método create, que si los datos introducidos son correctos
     * Guarda al usuario en la base de datos y carga la vista de inicio con el usuario logeado
     * 
     * @param UsuariosPost $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(UsuariosPost $request)
    {
        $archivoPath = null;

        if ($request->hasFile('avatar')) {
            $archivoPath = $request->file('avatar')->store('repositorio_ficheros');
        }
        if (!str_contains($archivoPath, 'googleusercontent.com')) {
            $archivoPath = Storage::url($archivoPath);
        }


        $usuario = Usuarios::create([
            'nick' => $request->nick,
            'nombre' => $request->nombre,
            'apellidos' => $request->apellidos,
            'password' => bcrypt($request->password),
            'email' => $request->email,
            'avatar' => $archivoPath
        ]);
        $this->login($request);
        return redirect()->route('usuarios.show', $usuario->id);
    }

    /**
     * Método show
     * 
     * En este método pasamos el id del usuario cuyos detalles queremos conocer,
     * Devolvemos la vista de usuarios.show con los datos de dicho usuario
     * 
     * @param string $id
     * @return \Illuminate\Contracts\View\View
     */
    public function show(string $id)
    {
        $usuario = Usuarios::findOrFail($id)->load(['hospeda', 'usuariosEventos']);

        return view('usuarios.show', compact('usuario'));
    }

    /**
     * Método edit
     * 
     * En este método devolvemos la vista del formulario de modificacion del usuario,
     * Pero solo si este esta logeado, sino retornamos la vista de inicio
     * 
     * @param string $id
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function edit(string $id)
    {
        if (auth()->check() && auth()->user()->id != $id) {
            return redirect()->route('inicio');
        }
        $usuario = Usuarios::findOrFail($id);
        return view('usuarios.edit', compact('usuario'));
    }

    /**
     * Método update
     * 
     * En este método llamamos al método de update para actualizar con los datos,
     * Que le pasamos por el formulario, si los datos estan vacios dejamos los datos que ya tiene
     * En la base de datos
     * 
     * @param UpdateUsuarios $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateUsuarios $request, string $id)
    {
        $usuario = Usuarios::findOrFail($id);
        $archivoPath = null;
        if ($request->hasFile('avatar') && $request->avatar != null) {
            $archivoPath = $request->file('avatar')->store('repositorio_ficheros');
        }
        if (!str_contains($archivoPath, 'googleusercontent.com') && $archivoPath != "") {
            $archivoPath = Storage::url($archivoPath);
        }
        $usuario->update([
            'nombre' => $request->nombre != "" ? $request->nombre : $usuario->nombre,
            'apellidos' => $request->apellidos != "" ? $request->apellidos : $usuario->apellidos,
            'avatar' => $archivoPath ?: $usuario->avatar
        ]);
        return redirect()->route('usuarios.show', $usuario->id);
    }

    /**
     * Método destroy
     * 
     * Pasamos el id del usuario a eliminar y lo borramos de la base de datos con el método delete
     * 
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(string $id)
    {
        $usuario = Usuarios::findOrFail($id);

        $usuario->delete();

        return redirect()->route('inicio');
    }

    /**
     * Método loginForm
     * 
     * En este nétodo devolvemos el formulario de autentificación
     * 
     * @return \Illuminate\Contracts\View\View
     */
    public function loginForm()
    {
        return view('usuarios.login');
    }

    /**
     * Método login
     * 
     * Este método recoge los datos del formulario de logeo y si estos son correctos,
     * Devuelve la vista de inicio, si los datos son incorrectos devuelve el formulario
     * De login con un mensaje de error
     * 
     * @param Request $request
     * @return \Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        $credenciales = $request->only('email', 'password');
        if (Auth::attempt($credenciales)) {
            return redirect()->route('inicio');
        } else {
            $error = 'Usuario incorrecto';
            return view('usuarios.login', compact('error', 'credenciales'));
        }
    }

    /**
     * Método de logout
     * 
     * Este método destruye la sesión
     * 
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout()
    {
        Auth::logout();
        return redirect()->route('inicio');
    }

    /**
     * Método signUp
     * 
     * Si el usuario este autentificado, el método permite inscribirse a un evento al usuario logeado,
     * Si no esta logeado redirige al formulario de logeo, si esta logeado, inscribe, suma
     * puntos de karma y redirige a la vista que toque
     * 
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function signUp(string $id, bool $show)
    {
        if (auth()->check()) {
            auth()->user()->usuariosEventos()->syncWithoutDetaching([$id]);
            auth()->user()->increment('karma', 3);
            if ($show == 1) {
                return redirect()->route('usuarios.show', auth()->user()->id);
            } else {
                return redirect()->route('inicio');
            }
        }
        return redirect()->route('login_form');
    }

    /**
     * Método signOff
     * 
     * Este método desuscribe al usuario del evento al que esta suscrito, resta el karma pertinente
     * y devuelve la vista que toque
     * 
     * @param string $id
     * @param bool $show
     * @return \Illuminate\Http\RedirectResponse
     */
    public function signOff(string $id, bool $show)
    {

        if (auth()->check()) {
            auth()->user()->usuariosEventos()->detach($id);
            auth()->user()->decrement('karma', 3);
            if ($show == 1) {
                return redirect()->route('usuarios.show', auth()->user()->id);
            } else {
                return redirect()->route('inicio');
            }
        }
        return redirect()->route('login_form');
    }
}
