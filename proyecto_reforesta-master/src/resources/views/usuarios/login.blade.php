<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de sesión</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body class="bodyForm">
    @include('navegacion')
    <div class="formulario">
        <form action="/login" method="POST">
            @csrf
            @method('POST')
            <label for="email">Email:</label>
            <input type="text" name="email" value="{{ old('email') }}"><br>
            <label for="password">Contraseña:</label>
            
            <input type="text" name="password" value="{{ old('password') }}"><br>
            <input class="button" type="submit" value="Iniciar sesión">
        </form>
        <div class="botones">
            <a href="{{ route('usuarios.create') }}"><button>Registrarse</button></a>
            <div class="social-login">
                <a href="{{ route('google.login') }}">
                    <button class="google-btn">
                        <img width="10px" height="10px" src="https://logopng.com.br/logos/google-37.png"
                            alt="Logo Google">
                        Iniciar con Google
                    </button>
                </a>
            </div>
        </div>

    </div>
</body>

</html>