<div class="nav">
   <nav>
      <a href="{{ '/' }}"><button>Inicio</button></a>
      <a href="{{ '/especies' }}"><button>Especies</button></a>
      <a href="{{ '/usuarios' }}"><button>Ranking</button></a>
      <a href="{{ '/calendario' }}"><button>Calendario</button></a>
      @if(auth()->check())
         <a href="/logout"><button>Cerrar sesión</button></a>
         <a href="{{ '/eventos/create/' }}"><button>Crear Eventos</button></a>
         <a href="/usuarios/{{ auth()->user()->id }}"><button>Ver perfil</button></a>
      @else
         <a href="{{ '/usuarios/create' }}"><button>Registro</button></a>
         <a href="{{ '/login_form' }}"><button>Login</button></a>
      @endif
   </nav>
   @if(auth()->check())
      <a class="userAvatar" href="{{ route('usuarios.show', auth()->user()->id)}}"><img src="{{  auth()->user()->avatar}}"
            onerror="this.src='/imagePlaceholder.png'" alt="Avatar de {{ auth()->user()->nick }}"></a>
   @endif
</div>