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
    <div class="">
        <div>
            <div>
                <?php
                    $tempUsuarios = $usuarios->all();
                    usort($tempUsuarios,function($a,$b){
                        if($a->karma > $b->karma){
                            return -1;
                        }else if($a->karma < $b->karma){
                            return 1;
                        }else{
                            return 0;
                        }
                    });
                ?>
                <h1>Ranking de Karma</h1>
                <table class="ranking">
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Karma</th>
                    </tr>
                    <?php
                        $cont = 10;
                        count($tempUsuarios) >= 10?"":$cont = count($tempUsuarios);
                    ?>
                    @for ($i = 0; $i < $cont; $i++)
                    <tr>
                        <td>#{{ $i+1 }}</td>
                        <td><a href="/usuarios/{{ $tempUsuarios[$i]->id }}">{{ $tempUsuarios[$i]->nombre }}</a></td>
                        <td>{{ $tempUsuarios[$i]->karma }}</td>
                    </tr>
                    @endfor
                </table>
            </div>

        </div>
    </div>
</body>

</html>