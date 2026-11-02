<?php

namespace App\Support;

class AuthorizationPolicy
{
    public static function canViewResource(array $user, int $resourceUserId, array $allowedRoles = []): bool
    {
        // Own resource or staff role
        if ($user['id'] === $resourceUserId) {
            return true;
        }

        if (in_array('super_admin', $user['roles'] ?? [], true)) {
            return true;
        }

        if (!empty($allowedRoles)) {
            foreach ($allowedRoles as $role) {
                if (in_array($role, $user['roles'] ?? [], true)) {
                    return true;
                }
            }
        }

        return false;
    }

    public static function canModifyResource(array $user, int $resourceUserId): bool
    {
        // Only own resource or super_admin
        return $user['id'] === $resourceUserId || in_array('super_admin', $user['roles'] ?? [], true);
    }

    public static function canDeleteResource(array $user, int $resourceOwnerId): bool
    {
        // Only super_admin can delete
        return in_array('super_admin', $user['roles'] ?? [], true);
    }

    public static function canManageHostel(array $user, int $hostelId): bool
    {
        // Warden of that hostel or super_admin
        if (in_array('super_admin', $user['roles'] ?? [], true)) {
            return true;
        }

        if (in_array('warden', $user['roles'] ?? [], true)) {
            // TODO: Check if user is warden of this hostel
            return true;
        }

        return false;
    }

    public static function canApproveLeave(array $user, int $studentHostelId): bool
    {
        if (in_array('super_admin', $user['roles'] ?? [], true)) {
            return true;
        }

        if (in_array('warden', $user['roles'] ?? [], true)) {
            // TODO: Check if user is warden of student's hostel
            return true;
        }

        return false;
    }

    public static function canAccessFinancials(array $user, int $hostelId): bool
    {
        if (in_array('super_admin', $user['roles'] ?? [], true)) {
            return true;
        }

        if (in_array('accountant', $user['roles'] ?? [], true)) {
            // TODO: Check if accountant is assigned to hostel
            return true;
        }

        return false;
    }

    public static function canViewAuditLog(array $user): bool
    {
        return in_array('super_admin', $user['roles'] ?? [], true);
    }

    public static function canManageUsers(array $user): bool
    {
        return in_array('super_admin', $user['roles'] ?? [], true);
    }
}
