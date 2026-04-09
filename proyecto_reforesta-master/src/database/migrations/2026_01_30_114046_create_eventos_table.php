<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre',50);
            $table->string('tipo_evento',50)->nullable();
            $table->string('tipo_terreno',50)->nullable();
            $table->string('ubicacion',70)->nullable();
            $table->date('fecha');
            $table->foreignId('anfitrion_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('descripcion',300)->nullable();
            $table->string('imagen',300)->nullable();
            $table->string('pdf',300)->nullable();
            $table->boolean('estado_evento')->default(false);
            $table->timestamp('fecha_creacion')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
