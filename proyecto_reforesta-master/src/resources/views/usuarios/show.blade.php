<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de {{ $usuario->nick }}</title>
    <link rel="stylesheet" href="/index.css">
</head>

<body>
    @include('navegacion')
    <main class="vistaUsuarios">
        <div>
            <section class="infoUser">
                <div class="infoUserText">
                    <h1><strong>Nick: </strong> {{$usuario->nick}}</h1>
                    <h3><strong>Nombre: </strong> {{$usuario->nombre}}</h3>
                    <h3><strong>Apellidos: </strong> {{$usuario->nombre}}</h3>
                    <h3><strong>Email: </strong> {{$usuario->nombre}}</h3>
                    <h3><strong>Karma: </strong> {{$usuario->karma}}</h3>
                </div>
                <div class="userInfoAvatar">
                    <img class="avatar-show" onerror="this.src='/imagePlaceholder.png'" src="{{ $usuario->avatar}}"
                        alt="Avatar de {{ $usuario->nick }}">
                    @if(auth()->check() && auth()->user()->id == $usuario->id)
                        <a href="{{ $usuario->id }}/edit"><button>Editar perfil</button></a>
                    @endif
                </div>
            </section>
            <h1>Eventos en los que es anfitrión</h1>
            <section class="userEvents">
                @foreach ($usuario->hospeda as $evento)
                    <article>
                        <div class="cabeceraEvento"
                            style="color:white;padding:5px;min-height:20%; background-image: url({{ $evento->imagen }}),url('/placeholderEvento.avif'); background-repeat: no-repeat; background-size: cover;">
                            <div class="titulo">
                                <h1>{{ $evento->nombre }} </h1>
                                <h3>Por <a
                                        href="{{ route('usuarios.show', $evento->anfitrion->id) }}">{{ $evento->anfitrion->nombre }}</a>
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
                        </div class="infoEvento">
                        <h3><strong>Ubicación: </strong>{{ $evento->ubicacion }}</h3>
                        <h3><strong>Tipo de Evento: </strong>{{ $evento->tipo_evento }}</h3>
                        <h3><strong>Fecha del evento: </strong>{{ ($evento->fecha)->format('d/m/Y')}}</h3>
                        <h4><strong>Estado:
                            </strong>{{ $evento->fecha >= new DateTime('today') ? "Abierto" : "Finalizado" }}</h4>
                        <a href="{{ route("eventos.show", $evento->id) }}"><button>Ver detalles</button></a>
                        @if (auth()->check() && auth()->user()->id == $evento->anfitrion_id)
                            <a href="{{ route("eventos.edit", $evento->id) }}"><button>Modificar evento</button></a>
                            <form action="{{ route('eventos.destroy', $evento->id) }}" method="POST">
                                @csrf
                                @method("DELETE")
                                <button class="button" type="submit"
                                    onclick="return confirm('Seguro que quieres borrar')">Eliminar</button>
                            </form>
                        @endif
                    </article>

                @endforeach
            </section>
            <h1>Eventos a los que está suscrito</h1>
            <section class="userSignedEvents">
                @foreach ($usuario->usuariosEventos as $evento)
                    <article>
                        <div class="cabeceraEvento"
                            style="color:white;padding:5px;min-height:20%; background-image: url({{ $evento->imagen }}),url('/placeholderEvento.avif'); background-repeat: no-repeat; background-size: cover;">
                            <div class="titulo">
                                <h1>{{ $evento->nombre }} </h1>
                                <h3>Por <a
                                        href="{{ route('usuarios.show', $evento->anfitrion->id) }}">{{ $evento->anfitrion->nombre }}</a>
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
                        </div class="infoEvento">
                        <h3><strong>Ubicación: </strong>{{ $evento->ubicacion }}</h3>
                        <h3><strong>Tipo de Evento: </strong>{{ $evento->tipo_evento }}</h3>
                        <h3><strong>Fecha del evento: </strong>{{ ($evento->fecha)->format('d/m/Y')}}</h3>
                        <h4><strong>Estado:
                            </strong>{{ $evento->fecha >= new DateTime('today') ? "Abierto" : "Finalizado" }}</h4>
                        <a href="{{ route("eventos.show", $evento->id) }}"><button>Ver detalles</button></a>
                        @if (auth()->check() && auth()->user()->id == $usuario->id)

                            <form action="{{ route('signOff', [$evento->id, 1]) }} " method="POST">
                                @csrf
                                @method('POST')
                                <input class="button" type="submit" value="Desuscribirse">
                            </form>
                        @endif
                    </article>
                @endforeach
            </section>
        </div>
    </main>
</body>

</html>