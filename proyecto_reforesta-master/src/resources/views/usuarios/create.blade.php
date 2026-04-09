<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio de sesión</title>
    <link rel="stylesheet" href="/index.css">
    <link rel="stylesheet" href="{{ asset('css/bootstrap.min.css') }}">
    <script src="{{ asset('js/bootstrap.bundle.min.js') }}"></script>
</head>

<body class="bodyForm">
    @include('navegacion')
    <div class="formulario">

        <form action="{{ route('usuarios.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('POST')
            <label for="nick">Nick:</label>
            <input type="text" name="nick" id="" value="{{ old('nick') }}"><br>
            @error('nick')
                <span>{{ $message }}</span>
            @enderror
            <br>

            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" id="" value="{{ old('nombre') }}"><br>
            @error('nombre')
                <span>{{ $message }}</span>
            @enderror
            <br>

            <label for="apellidos">Apellidos:</label>
            <input type="text" name="apellidos" id="" value="{{ old('apellidos') }}"><br>
            @error('apellidos')
                <span>{{ $message }}</span>
            @enderror
            <br>

            <label for="email">Email:</label>
            <input type="text" name="email" id="" value="{{ old('email') }}"><br>
            @error('email')
                <span>{{ $message }}</span>
            @enderror
            <br>

            <label for="password">Password:</label>
            <input type="text" name="password" id="" value="{{ old('password') }}"><br>
            @error('password')
                <span>{{ $message }}</span>
            @enderror
            <br>

            <label for="avatar">Avatar:</label>
            <input type="file" name="avatar" id="" value="{{ old('avatar') }}"><br>
            @error('avatar')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <input class="button" type="submit" value="Registrarse">
        </form>

        <div class="botones">
            <a href="{{ route('login_form') }}"><button>Iniciar sesión</button></a>
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