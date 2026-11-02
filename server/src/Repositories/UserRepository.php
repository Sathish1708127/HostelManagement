<?php
namespace App\Repositories;

use App\Config\Database;
use PDO;

final class UserRepository
{
    public static function findBySupabaseId(string $supabaseId): ?array
    {
        $statement = Database::connection()->prepare(
            'SELECT users.id, users.uuid, users.supabase_id, users.email, users.display_name,
                    GROUP_CONCAT(roles.name ORDER BY roles.name) roles
             FROM users
             LEFT JOIN user_roles ON user_roles.user_id = users.id
             LEFT JOIN roles ON roles.id = user_roles.role_id
             WHERE users.supabase_id = :supabase_id AND users.deleted_at IS NULL
             GROUP BY users.id'
        );
        $statement->execute(['supabase_id' => $supabaseId]);
        $user = $statement->fetch();
        if (!$user) {
            return null;
        }
        $user['roles'] = $user['roles'] ? explode(',', $user['roles']) : [];
        return $user;
    }

    public static function syncIdentity(string $supabaseId, string $email, ?string $displayName): array
    {
        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $statement = $pdo->prepare(
                'INSERT INTO users (uuid, supabase_id, email, display_name)
                 VALUES (UUID(), :supabase_id, :email, :display_name)
                 ON DUPLICATE KEY UPDATE
                   supabase_id = VALUES(supabase_id),
                   display_name = COALESCE(VALUES(display_name), display_name)'
            );
            $statement->execute([
                'supabase_id' => $supabaseId,
                'email' => $email,
                'display_name' => $displayName,
            ]);

            $user = self::findBySupabaseId($supabaseId);
            if ($user !== null && count($user['roles']) === 0) {
                $role = $pdo->query("SELECT id FROM roles WHERE name = 'student'")->fetchColumn();
                $assign = $pdo->prepare(
                    'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (:user_id, :role_id)'
                );
                $assign->execute(['user_id' => $user['id'], 'role_id' => $role]);
            }
            $pdo->commit();
            return self::findBySupabaseId($supabaseId) ?? [];
        } catch (\Throwable $exception) {
            $pdo->rollBack();
            throw $exception;
        }
    }
}
