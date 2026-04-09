<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar perfil</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body class="bodyForm">
    @include('navegacion')
    <div class="formulario">
        <form action="{{ route('usuarios.update', $usuario->id) }}" method="POST"  enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <label for="nombre">Nombre:</label>
            <input type="text" name="nombre" id="" value="{{ old('nombre') ? old('nombre') : $usuario->nombre }}"><br>
            @error('nombre')
                <span>{{ $message }}</span>
            @enderror
            <br>

            <label for="apellidos">Apellidos:</label>
            <input type="text" name="apellidos" id="" value="{{ old('apellidos') ? old('apellidos') : $usuario->apellidos }}"><br>
            @error('apellidos')
                <span>{{ $message }}</span>
            @enderror
            <br>

            <label for="avatar">Nuevo avatar:</label>
            <input type="file" name="avatar" id=""><br>
            @error('avatar')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <img width="50px" src="{{ old('avatar') ? old('avatar') : $usuario->avatar }}" alt="">
            <input class="button" type="submit" value="Editar perfil">
        </form>
    </div>
</body>

</html>