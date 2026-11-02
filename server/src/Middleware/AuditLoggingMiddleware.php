<?php

namespace App\Middleware;

class AuditLoggingMiddleware
{
    private const AUDIT_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

    public static function log(
        int $userId,
        string $method,
        string $path,
        string $module,
        string $action,
        string $entityType,
        ?string $entityId,
        ?array $oldValues,
        ?array $newValues,
        bool $success = true,
        ?string $errorMessage = null
    ): void {
        if (!in_array($method, self::AUDIT_METHODS, true)) {
            return;
        }

        $logEntry = [
            'uuid' => bin2hex(random_bytes(18)),
            'user_id' => $userId,
            'module' => $module,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => self::getClientIp(),
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
            'status' => $success ? 'success' : 'failed',
            'error_message' => $errorMessage,
            'action_date' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s'),
        ];

        // TODO: Insert into audit_logs table
        self::insertAuditLog($logEntry);
    }

    public static function getClientIp(): string
    {
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            return $_SERVER['HTTP_CF_CONNECTING_IP'];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED'])) {
            return $_SERVER['HTTP_X_FORWARDED'];
        }
        if (!empty($_SERVER['HTTP_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_FORWARDED_FOR'];
        }
        if (!empty($_SERVER['HTTP_FORWARDED'])) {
            return $_SERVER['HTTP_FORWARDED'];
        }
        return $_SERVER['REMOTE_ADDR'] ?? '';
    }

    private static function insertAuditLog(array $entry): void
    {
        // TODO: Insert audit log into database
    }

    public static function getAuditTrail(
        ?string $entityType,
        ?string $entityId,
        ?int $userId,
        int $limit = 100
    ): array {
        // TODO: Query audit logs with optional filters
        return [];
    }

    public static function exportAuditLog(
        string $fromDate,
        string $toDate,
        string $format = 'csv'
    ): void {
        // TODO: Export audit logs in CSV/JSON format
    }
}
