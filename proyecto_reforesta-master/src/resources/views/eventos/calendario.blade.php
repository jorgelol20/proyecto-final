<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio</title>
    <link rel="stylesheet" href="/index.css">
    <style>
        /* Contenedor principal para el fondo crema */
        body {
            background-color: #F5E1C8;
            /* El tono crema de tu imagen */
            font-family: 'serif', 'Times New Roman';
            /* Estética más clásica */
        }

        #calendar {
            max-width: 900px;
            margin: 40px auto;
            padding: 20px;
        }

        /* --- CABECERA (Mes y Botones) --- */
        .fc-toolbar-title {
            color: white !important;
            background-color: #333333;
            padding: 10px 20px;
            border-radius: 8px;
            text-transform: capitalize;
        }

        .fc-button-primary {
            background-color: #333333 !important;
            border: 1px solid #000 !important;
            border-radius: 4px !important;
            text-transform: capitalize !important;
            font-weight: bold !important;
        }

        .fc-button-primary:hover {
            background-color: #444444 !important;
        }

        /* --- CUADRÍCULA DEL CALENDARIO --- */
        .fc-theme-standard td,
        .fc-theme-standard th {
            border: 1px solid #999 !important;
            /* Bordes finos y grises */
        }

        /* Encabezados de los días (Mon, Tue...) */
        .fc-col-header-cell {
            background-color: #949494 !important;
            color: white !important;
            padding: 8px 0 !important;
        }

        /* Celdas de los días */
        .fc-daygrid-day {
            background-color: transparent !important;
        }

        .fc-daygrid-day-number {
            color: #000 !important;
            font-weight: bold;
            padding: 5px !important;
        }

        /* --- EVENTOS (El estilo granate) --- */
        .fc-event {
            background-color: #8B0000 !important;
            /* Rojo granate oscuro */
            border: none !important;
            border-radius: 4px !important;
            margin: 2px 4px !important;
            padding: 3px 6px !important;
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .fc-event-title {
            color: #F5E1C8 !important;
            /* Texto crema sobre fondo rojo */
            font-weight: bold;
            font-size: 0.9em;
        }

        /* --- HOY (Resaltado suave) --- */
        .fc-day-today {
            background-color: rgba(0, 0, 0, 0.05) !important;
        }
    </style>
</head>

<body>
    @include('navegacion')
    <div>
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>

        <div id='calendar' style="background-color: white; padding: 1%; z-index: 1;"></div>
        <script>
            let eventos = [];
            let tempEventos = @json($eventos);
            for (const evento of tempEventos) {
                const rutaBase = "{{ route('eventos.show', ['evento' => '__ID__']) }}";

                const tempEvento = {
                    title: evento.nombre,
                    start: evento.fecha,
                    // 2. Reemplazamos el marcador por el ID real de cada evento
                    url: rutaBase.replace('__ID__', evento.id),
                    backgroundColor: '#0004ff'
                };
                eventos.push(tempEvento);
            }
            document.addEventListener('DOMContentLoaded', function () {
                var calendarEl = document.getElementById('calendar');

                var calendar = new FullCalendar.Calendar(calendarEl, {
                    // 1. Define la vista inicial (obligatorio en v6)
                    initialView: 'dayGridMonth',

                    // 2. Pasa los eventos dentro de la propiedad 'events'
                    events: eventos
                });

                calendar.render();
            });
        </script>
    </div>
</body>

</html>