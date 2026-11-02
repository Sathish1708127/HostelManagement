<?php

namespace App\Middleware;

use App\Support\HttpException;

class CsrfProtectionMiddleware
{
    private const COOKIE_NAME = 'csrf_token';
    private const HEADER_NAME = 'X-CSRF-Token';
    private const FORM_FIELD = '_csrf';

    public static function generateToken(): string
    {
        $token = bin2hex(random_bytes(32));
        self::setTokenCookie($token);
        return $token;
    }

    public static function getToken(): string
    {
        // Return from cookie if set
        return $_COOKIE[self::COOKIE_NAME] ?? self::generateToken();
    }

    public static function verify(): void
    {
        $cookieToken = $_COOKIE[self::COOKIE_NAME] ?? null;
        
        if (!$cookieToken) {
            throw new HttpException('CSRF token missing from cookie.', 403);
        }

        $submittedToken = self::getSubmittedToken();
        
        if (!$submittedToken) {
            throw new HttpException('CSRF token missing from request.', 403);
        }

        if (!hash_equals($cookieToken, $submittedToken)) {
            throw new HttpException('CSRF token mismatch.', 403);
        }
    }

    public static function shouldProtect(string $method): bool
    {
        return in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true);
    }

    private static function getSubmittedToken(): ?string
    {
        // Check header first
        $headers = getallheaders();
        if (isset($headers[self::HEADER_NAME])) {
            return $headers[self::HEADER_NAME];
        }

        // Check JSON body
        $body = json_decode(file_get_contents('php://input'), true);
        if (isset($body[self::FORM_FIELD])) {
            return $body[self::FORM_FIELD];
        }

        // Check POST data
        return $_POST[self::FORM_FIELD] ?? null;
    }

    private static function setTokenCookie(string $token): void
    {
        setcookie(
            self::COOKIE_NAME,
            $token,
            [
                'expires' => time() + 86400,
                'path' => '/',
                'domain' => $_SERVER['HTTP_HOST'] ?? '',
                'secure' => !self::isLocalhost(),
                'httponly' => true,
                'samesite' => 'Strict',
            ]
        );
    }

    private static function isLocalhost(): bool
    {
        return in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true);
    }
}
