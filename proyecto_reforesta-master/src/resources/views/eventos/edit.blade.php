<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar evento {{ $evento->nombre }}</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body class="bodyForm">
    @include('navegacion')
    <div class="formulario">
        <form action="{{ route('eventos.update', $evento->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method("PUT")
            <label for="fecha">Fecha del evento: </label>
            <input type="date" name="fecha" id=""
                value="{{ old('fecha') !== null ? old('fecha') : (new DateTime($evento->fecha))->format('Y-m-d') }}"><br>
            @error('fecha')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="descripcion">Descripción del evento: </label><br>
            <textarea name="descripcion"
                id="">{{ old('descripcion') !== null ? old('descripcion') : $evento->descripcion }}</textarea><br>
            @error('descripcion')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <label for="especie">Especie a plantar:</label>
            <select name="especie" id="especie">
                <option value="null">Ninguna especie a plantar</option>
                @foreach ($especies as $especie)
                    @if(count($evento->especies) > 0 && $especie->id == $evento->especies[0]->id)
                        <option selected value="{{ $especie->id }}">{{ $especie->nombre }}</option>
                    @else()
                        <option value="{{ $especie->id }}">{{ $especie->nombre }}</option>
                    @endif()
                @endforeach
            </select>
            <br>
            <label for="imagen">Imagen del evento:</label>
            <input type="file" name="imagen" id=""
                value="{{ old('imagen') !== null ? old('imagen') : $evento->imagen }}"><br>
            @error('imagen')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <br>
            <label for="pdf">PDF del evento:</label>
            <input type="file" name="pdf" id="" value="{{ old('pdf') }}"><br>
            @error('pdf')
                <span>{{ $message }}</span>
            @enderror
            <br>
            <input class="button" type="submit" value="Modificar evento">
        </form>
    </div>
</body>

</html>