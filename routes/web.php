<?php

use Illuminate\Support\Facades\Route;

Route::get('/reset-password/{token}', fn() => view('app'))->name('password.reset');

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');