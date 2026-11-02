<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class CommunityController extends ApiController
{
    public static function createPost(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $validated = [
            'post_title' => Validator::requiredString($body, 'post_title', 255),
            'post_content' => Validator::requiredString($body, 'post_content', 10000),
            'post_category' => Validator::oneOf($body, 'post_category', ['skill_exchange', 'event', 'discussion', 'helpwanted', 'other']),
            'is_anonymous' => (bool) ($body['is_anonymous'] ?? false),
            'allow_comments' => (bool) ($body['allow_comments'] ?? true),
        ];
        
        // TODO: Create community post
        return $validated;
    }

    public static function getPosts(): array
    {
        $user = self::requireAuth();
        
        $hostelId = (int) Request::param('hostel_id');
        $category = Request::query('category');
        $page = self::getPage();
        $perPage = self::getPerPage();
        
        // TODO: Get community posts with optional category filter
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function getPost(): array
    {
        $user = self::requireAuth();
        $postId = Request::param('post_id');
        
        // TODO: Get post details and increment view count
        return [];
    }

    public static function addComment(): array
    {
        $user = self::requireAuth();
        
        $postId = Request::param('post_id');
        $body = Request::json();
        
        $comment = Validator::requiredString($body, 'comment', 2000);
        
        // TODO: Add comment to post
        return ['commented' => true];
    }

    public static function likePost(): array
    {
        $user = self::requireAuth();
        
        $postId = Request::param('post_id');
        
        // TODO: Like or unlike post
        return ['liked' => true];
    }

    public static function reportPost(): array
    {
        $user = self::requireAuth();
        
        $postId = Request::param('post_id');
        $body = Request::json();
        
        $reason = Validator::requiredString($body, 'reason', 100);
        $description = trim((string) ($body['description'] ?? ''));
        
        // TODO: Report post for moderation
        return ['reported' => true];
    }

    public static function deletePost(): array
    {
        $user = self::requireAuth();
        
        $postId = Request::param('post_id');
        
        // TODO: Delete post (only own posts unless staff)
        return ['deleted' => true];
    }

    public static function moderatePost(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $postId = Request::param('post_id');
        $body = Request::json();
        
        $action = Validator::oneOf($body, 'action', ['approve', 'hide', 'delete']);
        $reason = trim((string) ($body['reason'] ?? ''));
        
        // TODO: Moderate post
        return ['moderated' => true];
    }

    public static function getModeration(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $hostelId = (int) Request::param('hostel_id');
        
        // TODO: Get pending moderation queue
        return [];
    }
}
