<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Evento {{ $evento->nombre }}</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body>
    @include('navegacion')
    <div class="cabeceraEvento"
        style="color:white;padding:5px;min-height:20%; background-image: url({{ $evento->imagen }}),url('/placeholderEvento.avif'); background-repeat: no-repeat; background-size: cover;">
        <div class="titulo">
            <h1>{{ $evento->nombre }} </h1>
            <h3>Por <a href="{{ route('usuarios.show', $evento->anfitrion->id) }}">{{ $evento->anfitrion->nombre }}</a>
            </h3>
        </div>
        <?php 
            $participa = false;
         ?>
        @if(auth()->check())
            @foreach ($evento->participantes as $participante)
                @if ($participante->id == auth()->user()->id)
                    <?php 
                        $participa = true;
                    ?>
                @endif
            @endforeach
        @endif()
        @if($evento->fecha >= new DateTime('today'))

            @if($participa)
                <form action="{{ route('signOff', [$evento->id, 1]) }} " method="POST">
                    @csrf
                    @method('POST')
                    <input class="button desuscribirse" type="submit" value="Desuscribirse">
                </form>
            @else
                <form action="{{ route('signUp', [$evento->id, 1]) }} " method="POST">
                    @csrf
                    @method('POST')
                    <input class="button desuscribirse" type="submit" value="Suscribirse">
                </form>
            @endif
        @endif
    </div>
    <div class="infoEvento">
        <h3><strong>Tipo de evento: </strong>{{ $evento->tipo_evento }}</h3>
        <h3><strong>Tipo de terreno: </strong>{{ $evento->tipo_terreno }}</h3>
        <h3><strong>Ubicación: </strong>{{ $evento->ubicacion }}</h3>
        <h3><strong>Fecha: </strong>{{ ($evento->fecha)->format('d/m/Y')}}
            ({{ $evento->fecha >= new DateTime('today') ? "Abierto" : "Finalizado"  }})</h3>
        <h3><strong>Descripción del evento: </strong></h3>
        <h4>{{ $evento->descripcion }}</h4>
        <h3><strong>Especie a plantar:</strong>
            {{ count($evento->especies) != 0 ? $evento->especies[0]->nombre : "Sin ninguna especie indicada" }}</h3>
        <h3><strong>Número de participantes: </strong>{{ count($evento->participantes) }}</h3>
        <div class="botones">

            <a href="{{ asset($evento->pdf) }}"><button>Descargar PDF</button></a>

            @if (auth()->check() && auth()->user()->id == $evento->anfitrion_id)
                <a href="{{ $evento->id }}/edit"><button>Editar evento</button></a>
                <form action="{{ route('eventos.destroy', $evento->id) }}" method="POST">
                    @csrf
                    @method("DELETE")
                    <button type="submit" onclick="return confirm('Seguro que quieres borrar')">Eliminar</button>
                </form>
            @endif
        </div>
    </div>
    </main>
</body>

</html>