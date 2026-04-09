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
       Schema::create('eventos_especies', function (Blueprint $table) {
            $table->foreignId('evento_id')->constrained('eventos')->onDelete('cascade');
            $table->foreignId('especie_id')->constrained('especies')->onDelete('cascade');
            $table->primary(['evento_id', 'especie_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos_especies');
    }
};
