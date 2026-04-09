<div>
    <section>
        @foreach ($eventos as $evento)
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
                </div>
                <h3><strong>Ubicación: </strong>{{ $evento->ubicacion }}</h3>
                <h3><strong>Tipo de Evento: </strong>{{ $evento->tipo_evento }}</h3>
                <h3><strong>Fecha del evento: </strong>{{ ($evento->fecha)->format('d/m/Y')}}</h3>
                <h4><strong>Estado: </strong>{{ $evento->fecha >= new DateTime('today') ? "Abierto" : "Finalizado" }}</h4>
                <div class="botones">
                    <a href="eventos/ {{ $evento->id }}"><button>Ver detalles</button></a>
                    @if (auth()->check() && auth()->user()->id == $evento->anfitrion_id)
                        <a href="eventos/ {{ $evento->id }}/edit"><button>Modificar evento</button></a>
                        <form action="{{ route('eventos.destroy', $evento->id) }}" method="POST">
                            @csrf
                            @method("DELETE")
                            <button class="button eliminar" type="submit"
                                onclick="return confirm('Seguro que quieres borrar')">Eliminar</button>
                        </form>
                    @endif
                </div>
            </article>
        @endforeach
    </section>
</div>