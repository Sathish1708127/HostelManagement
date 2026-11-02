<?php

namespace App\Middleware;

use App\Support\HttpException;

class RateLimitMiddleware
{
    private const LIMITS = [
        'login' => ['requests' => 5, 'window' => 300],
        'upload' => ['requests' => 10, 'window' => 3600],
        'complaint' => ['requests' => 20, 'window' => 86400],
        'qr_verify' => ['requests' => 50, 'window' => 3600],
        'api' => ['requests' => 1000, 'window' => 3600],
        'public' => ['requests' => 100, 'window' => 3600],
    ];

    public static function check(string $endpoint, string $identifier): void
    {
        $limit = self::LIMITS[$endpoint] ?? self::LIMITS['api'];
        $key = "rate_limit:{$endpoint}:{$identifier}";
        
        // TODO: Use Redis or file-based cache
        $current = self::getCurrentCount($key);
        
        if ($current >= $limit['requests']) {
            throw new HttpException('Rate limit exceeded. Please try again later.', 429);
        }
        
        self::incrementCount($key, $limit['window']);
    }

    private static function getCurrentCount(string $key): int
    {
        // TODO: Implement cache backend (Redis preferred)
        return 0;
    }

    private static function incrementCount(string $key, int $ttl): void
    {
        // TODO: Increment counter with TTL
    }

    public static function getRemaining(string $endpoint, string $identifier): int
    {
        $limit = self::LIMITS[$endpoint] ?? self::LIMITS['api'];
        $key = "rate_limit:{$endpoint}:{$identifier}";
        $current = self::getCurrentCount($key);
        
        return max(0, $limit['requests'] - $current);
    }

    public static function getResetTime(string $endpoint, string $identifier): int
    {
        // TODO: Get time until rate limit resets
        return time() + 3600;
    }
}
