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
        Schema::create('especies', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('nombre',50);
            $table->string('clima',30)->nullable();
            $table->string('region',50)->nullable();
            $table->string('imagen',300)->nullable();
            $table->string('beneficios',100)->nullable();
            $table->string('descripcion',50)->nullable();
            $table->integer('tiempo_crecimiento')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('especies');
    }
};
