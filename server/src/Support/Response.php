<?php
namespace App\Support;

final class Response
{
    public static function success(mixed $data, int $status = 200, array $meta = []): never
    {
        self::send(['data' => $data, 'meta' => (object) $meta, 'error' => null], $status);
    }

    public static function error(string $message, int $status, array $details = []): never
    {
        self::send([
            'data' => null,
            'meta' => (object) [],
            'error' => ['message' => $message, 'details' => (object) $details],
        ], $status);
    }

    private static function send(array $payload, int $status): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}
