<?php

namespace App\Models;

use Database\Factories\ClassManagerFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassManager extends Model
{
    /** @use HasFactory<ClassManagerFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'nama_cm',
        'program',
        'batch',
        'bulan',
        'kr1_1',
        'kr1_2',
        'kr1_3',
        'kr1_4',
    ];

    /**
     * @return HasMany<TopsisResult, $this>
     */
    public function topsisResults(): HasMany
    {
        return $this->hasMany(TopsisResult::class);
    }
}
