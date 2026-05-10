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
        Schema::table('evaluation_results', function (Blueprint $table) {
            $table->decimal('saw_score', 10, 4)->nullable()->after('manager_id');
            $table->decimal('ml_score', 10, 4)->nullable()->after('saw_score');
            $table->decimal('hybrid_score', 10, 4)->nullable()->after('ml_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('evaluation_results', function (Blueprint $table) {
            $table->dropColumn(['saw_score', 'ml_score', 'hybrid_score']);
        });
    }
};
