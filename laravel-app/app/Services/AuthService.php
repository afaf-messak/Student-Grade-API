<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AuthService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.auth.url', env('AUTH_SERVICE_URL', 'http://auth-service:3001'));
    }

    /**
     * Vérifier un token JWT via le Auth Service
     */
    public function verifyToken(string $token): array
    {
        try {
            $response = Http::timeout(5)->post("{$this->baseUrl}/api/auth/verify-token", [
                'token' => $token,
            ]);

            return $response->json();
        } catch (\Exception $e) {
            return [
                'success' => false,
                'valid'   => false,
                'message' => 'Auth Service inaccessible : ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Récupérer l'utilisateur depuis le token dans la requête
     */
    public function getUserFromRequest(\Illuminate\Http\Request $request): ?array
    {
        $token = $request->bearerToken();

        if (!$token) {
            return null;
        }

        $result = $this->verifyToken($token);

        if (!($result['success'] ?? false) || !($result['valid'] ?? false)) {
            return null;
        }

        return $result['user'] ?? null;
    }
}
