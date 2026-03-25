<?php

namespace App\Http\Middleware;

use App\Services\AuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithAuthService
{
    public function __construct(protected AuthService $authService)
    {
    }

    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $this->authService->getUserFromRequest($request);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié. Token manquant ou invalide.',
            ], 401);
        }

        // Vérifier le rôle si spécifié
        if (!empty($roles) && !in_array($user['role'], $roles)) {
            return response()->json([
                'success' => false,
                'message' => "Accès refusé. Rôle '{$user['role']}' non autorisé.",
            ], 403);
        }

        // Attacher l'utilisateur à la requête
        $request->merge(['auth_user' => $user]);

        return $next($request);
    }
}
