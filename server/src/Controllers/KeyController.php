<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class KeyController extends ApiController
{
    public static function issueKey(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'key_type' => Validator::oneOf($body, 'key_type', ['room', 'common_area', 'master', 'emergency']),
            'room_id' => isset($body['room_id']) ? (int) $body['room_id'] : null,
            'issued_to' => Validator::requiredInt($body, 'issued_to'),
            'is_master' => (bool) ($body['is_master'] ?? false),
        ];
        
        // TODO: Create key and issue to user
        return $validated;
    }

    public static function returnKey(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $keyId = Request::param('key_id');
        $body = Request::json();
        
        $condition = Validator::oneOf($body, 'condition', ['good', 'damaged', 'lost']);
        $notes = trim((string) ($body['notes'] ?? ''));
        
        // TODO: Record key return and condition
        return ['returned' => true];
    }

    public static function reportLost(): array
    {
        $user = self::requireAuth();
        
        $keyId = Request::param('key_id');
        $body = Request::json();
        
        $lostDate = Validator::requiredString($body, 'lost_date', 10);
        $description = trim((string) ($body['description'] ?? ''));
        
        // TODO: Report key as lost and create charge
        return ['reported' => true, 'replacement_charge' => 0];
    }

    public static function requestReplacement(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $keyId = Request::param('key_id');
        $body = Request::json();
        
        $reason = Validator::requiredString($body, 'reason', 255);
        
        // TODO: Request key replacement
        return ['replacement_requested' => true];
    }

    public static function getKeyLog(): array
    {
        $user = self::requireAuth();
        
        $keyId = (int) Request::param('key_id');
        
        // TODO: Get complete key transaction history
        return [];
    }

    public static function getMyKeys(): array
    {
        $user = self::requireAuth();
        
        // TODO: Get all keys currently held by user
        return [];
    }

    public static function verifyKey(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $body = Request::json();
        
        $keyCode = Validator::requiredString($body, 'key_code', 50);
        
        // TODO: Verify key is valid and check holder
        return ['valid' => true, 'holder' => []];
    }

    public static function getLostKeys(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        // TODO: Get all reported lost keys with charges
        return [];
    }
}
