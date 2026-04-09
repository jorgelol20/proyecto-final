<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios_eventos', function (Blueprint $table) {
            $table->primary(['usuarios_id', 'eventos_id']);
            $table->foreignId('usuarios_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('eventos_id')->constrained('eventos')->onDelete('cascade');
            

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios_eventos');
    }
};
