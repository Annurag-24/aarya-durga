<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Parse the token from the request
            if (!JWTAuth::setRequest($request)->parseToken()) {
                return response()->json(['error' => 'Token not found'], 401);
            }

            // Check if token is valid
            if (!JWTAuth::check()) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            // Get the claim data (subject = user ID)
            $payload = JWTAuth::getPayload();
            $userId = $payload->get('sub');

            // Look up the admin user
            $user = \App\Models\Admin::find($userId);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }

            // Set the user for this request
            auth('admin')->setUser($user);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token error'], 401);
        }

        return $next($request);
    }
}
