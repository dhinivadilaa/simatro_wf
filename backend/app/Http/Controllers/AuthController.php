<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function loginAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Verifikasi Kredensial
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => ['Kredensial salah.']]);
        }

        // Verifikasi Peran (Role Admin/Panitia)
        // ASUMSI: Role ID 1 dan 2 adalah Admin/Panitia
        if (!in_array($user->role_id, [1, 2])) {
            throw ValidationException::withMessages(['email' => ['Akses ditolak. Anda bukan admin.']]);
        }
        
        // Buat Token Sanctum
        $token = $user->createToken('admin-token', ['admin'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load('role'),
        ]);
    }
    
    // Anda juga perlu metode untuk logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout berhasil.']);
    }
}