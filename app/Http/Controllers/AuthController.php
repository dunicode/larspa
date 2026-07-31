<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Hash;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function register(Request $request){
        $registerUserData = $request->validate([
            'name'=>'required|string',
            'email'=>'required|string|email|unique:users',
            'password'=>'required|min:8'
        ]);
        $user = User::create([
            'name' => $registerUserData['name'],
            'email' => $registerUserData['email'],
            'password' => Hash::make($registerUserData['password']),
        ]);
        return response()->json([
            'message' => 'User Created ',
        ]);
    }

    public function login(Request $request){
        $loginUserData = $request->validate([
            'email'=>'required|string|email',
            'password'=>'required|min:8',
            'device_name' => 'required|string',
        ]);
        $user = User::where('email',$loginUserData['email'])->first();
        if(!$user || !Hash::check($loginUserData['password'],$user->password)){
            return response()->json([
                'message' => 'Invalid Credentials'
            ],401);
        }

        $deviceName = trim(substr($loginUserData['device_name'], 0, 100));
        $token = $user->createToken($deviceName ?: 'web')->plainTextToken;

        return response()->json([
            'access_token' => $token,
        ]);
    }

    public function profile(Request $request){
        return $request->user();
    }

    public function sessions(Request $request)
    {
        $user = $request->user();
        $currentToken = $user->currentAccessToken();

        $sessions = $user->tokens()
            ->select('id', 'name', 'created_at', 'last_used_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($token) use ($currentToken) {
                return [
                    'id' => $token->id,
                    'device' => $token->name,
                    'created_at' => $token->created_at?->toDateTimeString(),
                    'last_used_at' => $token->last_used_at?->toDateTimeString(),
                    'is_current' => $currentToken ? $currentToken->id === $token->id : false,
                ];
            });

        return response()->json(['sessions' => $sessions]);
    }

    public function deleteSession(Request $request, $id)
    {
        $user = $request->user();
        $currentToken = $user->currentAccessToken();
        $session = $user->tokens()->where('id', $id)->first();

        if (!$session) {
            return response()->json(['message' => 'Sesión no encontrada.'], 404);
        }

        if ($currentToken && $session->id === $currentToken->id) {
            return response()->json(['message' => 'No puedes cerrar la sesión actual.'], 422);
        }

        $session->delete();

        return response()->json(['status' => 'Sesión cerrada correctamente.']);
    }

    public function terminateOtherSessions(Request $request)
    {
        $user = $request->user();
        $currentToken = $user->currentAccessToken();

        if ($currentToken) {
            $user->tokens()->where('id', '!=', $currentToken->id)->delete();
        } else {
            $user->tokens()->delete();
        }

        return response()->json(['status' => 'Otras sesiones cerradas correctamente.']);
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            "message" => "Session closed"
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Intentamos enviar el enlace de restablecimiento
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['status' => __($status)])
            : response()->json(['errors' => ['email' => [__($status)]]], 422);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['status' => __($status)])
            : response()->json(['errors' => ['email' => [__($status)]]], 422);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'errors' => ['current_password' => ['La contraseña actual es incorrecta.']],
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        $currentToken = $request->user()->currentAccessToken();
        $deviceName = $currentToken?->name ?? 'current-device';

        if ($currentToken) {
            $user->tokens()->where('id', '!=', $currentToken->id)->delete();
            $currentToken->delete();
        } else {
            $user->tokens()->delete();
        }

        $newToken = $user->createToken($deviceName.'-AuthToken')->plainTextToken;

        return response()->json([
            'status' => 'Contraseña actualizada correctamente.',
            'access_token' => $newToken,
        ]);
    }
    
}
