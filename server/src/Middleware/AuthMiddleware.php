<?php
namespace App\Middleware;

use App\Config\Env;
use App\Repositories\UserRepository;
use App\Support\HttpException;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use GuzzleHttp\Client;

final class AuthMiddleware
{
    public static function authenticate(): array
    {
        $token = self::bearerToken();

        if (Env::bool('SUPABASE_MOCK', false) && $token === 'mock-token') {
            $demoUser = UserRepository::findBySupabaseId('demo-warden');
            if ($demoUser === null) {
                throw new HttpException(
                    'Demo user is missing. Run the development database seeder.',
                    503
                );
            }
            return $demoUser;
        }

        $claims = self::decodeToken($token);
        $supabaseId = (string) ($claims->sub ?? '');
        $email = (string) ($claims->email ?? '');
        if ($supabaseId === '' || $email === '') {
            throw new HttpException('Authentication token is missing required identity claims.', 401);
        }

        return UserRepository::findBySupabaseId($supabaseId)
            ?? UserRepository::syncIdentity(
                $supabaseId,
                $email,
                isset($claims->user_metadata->full_name)
                    ? (string) $claims->user_metadata->full_name
                    : null
            );
    }

    public static function requireRole(array $user, array $allowedRoles): void
    {
        if (count(array_intersect($user['roles'] ?? [], $allowedRoles)) === 0) {
            throw new HttpException('You do not have permission to perform this action.', 403);
        }
    }

    private static function bearerToken(): string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            throw new HttpException('A valid Bearer token is required.', 401);
        }
        return trim($matches[1]);
    }

    private static function decodeToken(string $token): object
    {
        $publicKey = Env::get('SUPABASE_JWT_PUBLIC_KEY');
        if ($publicKey !== null) {
            return JWT::decode($token, new Key(str_replace('\n', "\n", $publicKey), 'RS256'));
        }

        $supabaseUrl = Env::get('SUPABASE_URL');
        if ($supabaseUrl === null) {
            throw new HttpException('Supabase token verification is not configured.', 500);
        }

        try {
            $client = new Client(['timeout' => 5]);
            $response = $client->get(
                rtrim($supabaseUrl, '/') . '/auth/v1/.well-known/jwks.json'
            );
            $jwks = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);
            return JWT::decode($token, JWK::parseKeySet($jwks));
        } catch (\Throwable) {
            throw new HttpException('Authentication token could not be verified.', 401);
        }
    }
}
