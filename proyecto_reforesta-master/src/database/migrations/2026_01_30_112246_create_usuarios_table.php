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
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nick',20)->unique();
            $table->string('nombre',20);
            $table->string('apellidos',50)->nullable();
            $table->string('password',255);
            $table->string('remember_token',100)->nullable();
            $table->string('email',50)->unique();
            $table->integer('karma')->default(0);
            $table->string('avatar',300)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
