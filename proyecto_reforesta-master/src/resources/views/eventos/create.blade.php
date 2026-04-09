<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear evento</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body class="bodyForm">
    @include('navegacion')
    <div class="formulario">
        <form action="{{ route('eventos.store') }}" method="POST"  enctype="multipart/form-data">
            @csrf
            @method('POST')
            <label for="nombre">Nombre del evento:</label>
            <input type="text" name="nombre" id="" value="{{ old('nombre') }}"><br>
            @error('nombre')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="tipo_evento">Tipo de evento:</label>
            <input type="text" name="tipo_evento" id="" value="{{ old('tipo_evento') }}"><br>
            @error('tipo_evento')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="tipo_terreno">Tipo de terreno</label>
            <input type="text" name="tipo_terreno" id="" value="{{ old('tipo_terreno') }}"><br>
            @error('tipo_terreno')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="ubicacion">Ubicación</label>
            <input type="text" name="ubicacion" id="" value="{{ old('ubicacion') }}"><br>
            @error('ubicacion')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="fecha">Fecha del evento: </label>
            <input type="date" name="fecha" id="" value="{{ old('fecha') }}"><br>
            @error('fecha')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="descripcion">Descripción del evento: </label><br>
            <textarea name="descripcion"
                id="">{{ old('descripcion')}}</textarea><br>
            @error('descripcion')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="especie">Especie a plantar:</label>
            <select name="especie" id="especie">
                <option value="null">Ninguna especie a plantar</option>
                @foreach ($especies as $especie)
                    <option value="{{ $especie->id }}">{{ $especie->nombre }}</option>
                @endforeach
            </select>
            <br>
            <label for="imagen">Imagen del evento:</label>
            <input type="file" name="imagen" id="" value="{{ old('imagen') }}"><br>
            @error('imagen')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="pdf">PDF del evento:</label>
            <input type="file" name="pdf" id="" value="{{ old('pdf') }}"><br>
            @error('pdf')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <input class="button" type="submit" value="Crear evento">
        </form>
    </div>
</body>

</html>