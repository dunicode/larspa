<?php

use Illuminate\Support\Facades\Route;

// Esta ruta captura el enlace del correo y le da el nombre que Laravel espera.
// Debe ir ANTES de la ruta genérica para que sea reconocida.
Route::get('/reset-password/{token}', fn() => view('app'))->name('password.reset');

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');