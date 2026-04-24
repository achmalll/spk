<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationResult extends Model
{
    protected $guarded = [];

    public function manager()
    {
        return $this->belongsTo(ClassManager::class, 'manager_id');
    }
}
