<?php
use App\Http\Controllers\EspeciesController;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\UsuariosController;
use App\Models\Usuarios;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\UsuarioController as UsuarioApiController;

Route::get('/', [EventosController::class, 'index'])->name('inicio');

Route::resource('usuarios', UsuariosController::class);
Route::resource('especies', EspeciesController::class);
Route::resource('eventos', EventosController::class);
Route::get('login_form', [UsuariosController::class, 'loginForm'])->name('login_form');
Route::post('login', [UsuariosController::class, 'login'])->name('login');
Route::get('logout', [UsuariosController::class, 'logout'])->name('logout');
Route::post('signUp/{id}/{show}', [UsuariosController::class, 'signUp'])->name('signUp');
Route::post('signOff/{id}/{show}', [UsuariosController::class, 'signOff'])->name('signOff');
Route::get('calendario', [EventosController::class, 'calendario'])->name('calendario');






Route::get('/auth/google', function () {
    return Socialite::driver('google')->redirect();
})->name('google.login');

Route::get('/auth/google/callback', function () {
    try {
        $usuario_google = Socialite::driver('google')->user();

        $user = Usuarios::updateOrCreate(
            ['email' => $usuario_google->getEmail()],
            [
                'nick' => $usuario_google->getNickname() ?? explode('@', $usuario_google->getEmail())[0],
                'nombre' => $usuario_google->user['given_name'] ?? $usuario_google->getName(),
                'apellidos' => $usuario_google->user['family_name'] ?? '',
                'password' => bcrypt(uniqid()),
                'avatar' => $usuario_google->getAvatar(),
            ]
        );
        Auth::login($user);
        return redirect()->route('inicio');
    } catch (Exception $e) {
        dump($e);
        return redirect()->route('login_form');
    }
});
