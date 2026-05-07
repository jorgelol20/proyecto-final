<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuarios;
use Auth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $usuario = Usuarios::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son correctas.'],
            ]);
        }

        $usuario = $usuario->load(['comentarios', 'tiene_jugadas']);
        $token = $usuario->createToken('api-token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    public function me(Request $request)
    {
        $usuario = $request->user();
        $usuario = $usuario->load(['comentarios', 'tiene_jugadas']);
        return response()->json($usuario);
    }

    //Inicio de sesión con Google
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        $usuario_google = Socialite::driver('google')->stateless()->user();

        $user = Usuarios::updateOrCreate(
            ['email' => $usuario_google->getEmail()],
            [
                'nick' => $usuario_google->getNickname() ?? explode('@', $usuario_google->getEmail())[0],
                'password' => bcrypt(uniqid()),
                'avatar' => $usuario_google->getAvatar(),
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        // Redirige al frontend pasando el token por URL
        return redirect(config('app.frontend_url')."/auth/callback?token={$token}");
    }

    //Inicio de sesión con Twitter
    public function redirectToX()
    {
        return Socialite::driver('twitter')->stateless()->redirect();
    }

    public function handleXCallback()
    {
        $xUser = Socialite::driver('twitter')->stateless()->user();

        $user = Usuarios::updateOrCreate(
            ['email' => $xUser->getNickname()."@Xaccount.com"],
            [
                'nick' => $xUser->getNickname(),
                'password'=>bcrypt($xUser->getId()),
                'avatar' => $xUser->getAvatar(),
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        return redirect(config('app.frontend_url')."/auth/callback?token={$token}");
    }
}
