<?php
namespace App\Support;

final class Request
{
    public static function json(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || trim($raw) === '') {
            return [];
        }

        $data = json_decode($raw, true);
        if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
            throw new HttpException('Request body must be valid JSON.', 422);
        }
        return $data;
    }

    public static function query(string $key, ?string $default = null): ?string
    {
        $value = $_GET[$key] ?? $default;
        return is_string($value) ? trim($value) : $default;
    }
}
