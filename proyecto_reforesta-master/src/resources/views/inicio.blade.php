<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body>
    @include('navegacion')
    <div class="eventos">
        @if ($eventos->isEmpty())
            <p>No hay eventos</p>
        @else
            @include('eventos.index')
        @endif
    </div>
</body>
</html>