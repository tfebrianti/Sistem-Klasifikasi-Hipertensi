<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelConfig extends Model
{
    use HasFactory;

    protected $table = 'model_configs';

    protected $fillable = [
        'active_model',
        'rf_trees',
        'rf_max_depth',
        'dt_min_samples',
        'lr_iterations',
        'confidence_factor',
    ];
}
