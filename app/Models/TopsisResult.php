<?php

namespace App\Models;

use Database\Factories\TopsisResultFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TopsisResult extends Model
{
    /** @use HasFactory<TopsisResultFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'class_manager_id',
        'nilai_preferensi',
        'ranking',
        'bulan',
    ];

    /**
     * @return BelongsTo<ClassManager, $this>
     */
    public function classManager(): BelongsTo
    {
        return $this->belongsTo(ClassManager::class);
    }
}
