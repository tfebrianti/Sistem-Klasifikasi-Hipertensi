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
        Schema::create('patients', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. PT-2023-001
            $table->string('name');
            $table->integer('age');
            $table->string('gender', 1); // L or P
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('status'); // e.g. Normal, Pra Hipertensi, Tingkat 1, Tingkat 2, Krisis Hipertensi
            $table->string('last_checked')->nullable();
            $table->json('bp_history')->nullable(); // JSON array [{date, systolic, diastolic}]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
