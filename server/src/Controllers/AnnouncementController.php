<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class AnnouncementController extends ApiController
{
    public static function create(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'title' => Validator::requiredString($body, 'title', 255),
            'content' => Validator::requiredString($body, 'content', 10000),
            'announcement_type' => Validator::oneOf($body, 'announcement_type', ['general', 'urgent', 'maintenance', 'event', 'rules']),
            'priority' => Validator::oneOf($body, 'priority', ['low', 'normal', 'high']),
            'expiry_date' => trim((string) ($body['expiry_date'] ?? '')),
            'is_pinned' => (bool) ($body['is_pinned'] ?? false),
            'audiences' => Validator::requiredArray($body, 'audiences'),
        ];
        
        // TODO: Create announcement with audience targeting
        return $validated;
    }

    public static function getAnnouncements(): array
    {
        $user = self::requireAuth();
        
        $page = self::getPage();
        $perPage = self::getPerPage();
        $type = Request::query('type');
        $unreadOnly = Request::query('unread_only') !== null;
        
        // TODO: Get announcements filtered by audience and optional type
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function show(): array
    {
        $user = self::requireAuth();
        $announcementId = Request::param('announcement_id');
        
        // TODO: Get announcement detail and mark as read
        return [];
    }

    public static function update(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $announcementId = Request::param('announcement_id');
        $body = Request::json();
        
        $validated = [
            'title' => trim((string) ($body['title'] ?? '')),
            'content' => trim((string) ($body['content'] ?? '')),
            'priority' => isset($body['priority']) ? Validator::oneOf($body, 'priority', ['low', 'normal', 'high']) : null,
            'is_pinned' => isset($body['is_pinned']) ? (bool) $body['is_pinned'] : null,
        ];
        
        // TODO: Update announcement
        return $validated;
    }

    public static function delete(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $announcementId = Request::param('announcement_id');
        
        // TODO: Soft delete announcement
        return ['deleted' => true];
    }

    public static function markAsRead(): array
    {
        $user = self::requireAuth();
        
        $announcementId = Request::param('announcement_id');
        
        // TODO: Mark announcement as read by user
        return ['read' => true];
    }

    public static function markAllAsRead(): array
    {
        $user = self::requireAuth();
        
        // TODO: Mark all announcements as read for user
        return ['all_marked_read' => true];
    }

    public static function getUnreadCount(): array
    {
        $user = self::requireAuth();
        
        // TODO: Get count of unread announcements
        return ['unread_count' => 0];
    }

    public static function getPinned(): array
    {
        $user = self::requireAuth();
        
        // TODO: Get currently pinned announcements
        return [];
    }
}
