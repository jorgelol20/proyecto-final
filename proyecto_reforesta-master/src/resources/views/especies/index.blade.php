<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Especies</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body>
    @include('navegacion')
    <div>
        <section class="especies">
            @foreach ($especies as $especie)
                <article class="especie">
                    <h1>{{ $especie->nombre }}</h1>
                    <h3>{{ $especie->region }}</h3>
                    <div id="imagenEspecie">
                        <img src="{{ $especie->imagen }}" onerror="this.src='/placeholderEspecie.avif'"
                        alt="{{ $especie->nombre }}">
                    </div>

                </article>
            @endforeach
        </section>
    </div>
</body>

</html>