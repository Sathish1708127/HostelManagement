<?php
namespace App\Support;

final class Validator
{
    public static function requiredString(array $data, string $field, int $max = 255): string
    {
        $value = $data[$field] ?? null;
        if (!is_string($value) || trim($value) === '') {
            throw new HttpException("The {$field} field is required.", 422, [$field => 'Required']);
        }
        $value = trim($value);
        if (mb_strlen($value) > $max) {
            throw new HttpException(
                "The {$field} field is too long.",
                422,
                [$field => "Maximum {$max} characters"]
            );
        }
        return $value;
    }

    public static function oneOf(array $data, string $field, array $allowed): string
    {
        $value = self::requiredString($data, $field, 80);
        if (!in_array($value, $allowed, true)) {
            throw new HttpException(
                "The {$field} field is invalid.",
                422,
                [$field => 'Allowed values: ' . implode(', ', $allowed)]
            );
        }
        return $value;
    }
}
