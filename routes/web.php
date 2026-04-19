<?php

use App\Http\Controllers\ClassManagerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('class-managers.index');
})->name('home');

Route::redirect('/dashboard', '/class-managers');

Route::post('class-managers/import', [ClassManagerController::class, 'import'])->name('class-managers.import');
Route::post('class-managers/calculate', [ClassManagerController::class, 'calculate'])->name('class-managers.calculate');
Route::resource('class-managers', ClassManagerController::class);

require __DIR__.'/settings.php';
