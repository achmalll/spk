<?php

use App\Http\Controllers\EvaluationController;
use Illuminate\Support\Facades\Route;

// Main Dashboard
Route::get('/', [EvaluationController::class, 'index'])->name('dashboard');

// Evaluation Actions
Route::post('/import', [EvaluationController::class, 'import'])->name('import');
Route::post('/reset', [EvaluationController::class, 'reset'])->name('reset');
Route::get('/template', [EvaluationController::class, 'template'])->name('template');
