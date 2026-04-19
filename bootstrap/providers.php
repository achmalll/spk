<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use Maatwebsite\Excel\ExcelServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    ExcelServiceProvider::class,
];
