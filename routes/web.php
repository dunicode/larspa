<?php

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/reset-password/{token}', fn() => view('app'))->name('password.reset');

Route::get('/email/verify/{id}/{hash}', function (Request $request, string $id, string $hash) {
    $user = User::find($id);

    if (! $user || ! hash_equals(sha1($user->getEmailForVerification()), (string) $hash)) {
        abort(403);
    }

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));
    }

    return redirect('/login?verified=1');
})->middleware(['signed', 'throttle:6,1'])->name('verification.verify');

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');