<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Admin login
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if (!$token = auth('admin')->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get current authenticated admin
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $admin = auth('admin')->user();

        return response()->json([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
        ]);
    }

    /**
     * Logout (token invalidation)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        JWTAuth::parseToken()->invalidate(true);

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh JWT token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $token = JWTAuth::parseToken()->refresh();

        return $this->respondWithToken($token);
    }

    /**
     * Return token response
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'admin' => [
                'id' => auth('admin')->user()->id,
                'name' => auth('admin')->user()->name,
                'email' => auth('admin')->user()->email,
            ],
        ]);
    }
}
