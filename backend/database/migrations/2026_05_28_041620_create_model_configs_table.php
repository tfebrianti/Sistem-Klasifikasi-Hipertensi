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
        Schema::create('model_configs', function (Blueprint $table) {
            $table->id();
            $table->string('active_model'); // Random Forest, Decision Tree, Logistic Regression
            $table->integer('rf_trees')->default(100);
            $table->integer('rf_max_depth')->default(12);
            $table->integer('dt_min_samples')->default(4);
            $table->integer('lr_iterations')->default(200);
            $table->double('confidence_factor')->default(0.98);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model_configs');
    }
};
