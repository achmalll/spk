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
        Schema::create('class_managers', function (Blueprint $table) {
            $table->id();
            $table->string('nama_cm');
            $table->string('program');
            $table->string('bulan');
            $table->decimal('kr1_1', 5, 2);
            $table->decimal('kr1_2', 5, 2);
            $table->decimal('kr1_3', 5, 2);
            $table->decimal('kr1_4', 5, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_managers');
    }
};
