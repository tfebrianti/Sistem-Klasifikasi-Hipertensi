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
        Schema::create('predictions', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. PAS-001
            $table->string('patient_id');
            $table->string('patient_name');
            $table->string('date');
            $table->string('model_used'); // e.g. Random Forest, Decision Tree, Logistic Regression
            $table->integer('confidence_score');
            $table->integer('accuracy_dt')->nullable();
            $table->integer('accuracy_rf')->nullable();
            $table->integer('systolic');
            $table->integer('diastolic');
            $table->integer('age');
            $table->string('gender', 1);
            $table->double('weight');
            $table->double('height');
            $table->double('bmi');
            $table->string('result'); // Normal, Pra Hipertensi, Tingkat 1, Tingkat 2, Krisis Hipertensi
            $table->timestamps();

            // Setup foreign key manually or keep loosely coupled for local SQLite
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
