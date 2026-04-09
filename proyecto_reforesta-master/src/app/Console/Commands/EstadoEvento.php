<?php

namespace App\Console\Commands;

use App\Models\Eventos;
use DateTime;
use Illuminate\Console\Command;

class EstadoEvento extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:estado-evento';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Summary of handle
     * @return void
     */
    public function handle()
    {
        $ahora = new DateTime('today');

        $update = Eventos::where('fecha', '<',$ahora)->where('estado_evento', '!=', true )->update(['estado_evento' => true]);

        $this->info("Eventos actualizados: {$update}");
    }
}
