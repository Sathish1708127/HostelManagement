<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class LostFoundController extends ApiController
{
    public static function createPost(): array
    {
        $user = self::requireAuth();
        
        $body = Request::json();
        
        $validated = [
            'item_type' => Validator::requiredString($body, 'item_type', 50),
            'item_description' => Validator::requiredString($body, 'item_description', 1000),
            'lost_or_found' => Validator::oneOf($body, 'lost_or_found', ['lost', 'found']),
            'date_occurred' => Validator::requiredString($body, 'date_occurred', 10),
            'location_description' => Validator::requiredString($body, 'location_description', 255),
            'item_value' => isset($body['item_value']) ? (float) $body['item_value'] : null,
            'reward_offered' => isset($body['reward_offered']) ? (float) $body['reward_offered'] : null,
            'item_color' => trim((string) ($body['item_color'] ?? '')),
        ];
        
        // TODO: Create lost/found post
        return $validated;
    }

    public static function getPosts(): array
    {
        $user = self::requireAuth();
        
        $hostelId = (int) Request::param('hostel_id');
        $type = Request::query('type');
        $page = self::getPage();
        $perPage = self::getPerPage();
        
        // TODO: Get lost/found posts with optional type filter
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function getMatches(): array
    {
        $user = self::requireAuth();
        
        $postId = (int) Request::param('post_id');
        
        // TODO: Get potential matches for lost/found item
        return [];
    }

    public static function suggestMatch(): array
    {
        $user = self::requireAuth();
        
        $body = Request::json();
        
        $lostPostId = Validator::requiredInt($body, 'lost_post_id');
        $foundPostId = Validator::requiredInt($body, 'found_post_id');
        
        // TODO: Suggest match between lost and found items
        return ['match_suggested' => true];
    }

    public static function verifyMatch(): array
    {
        $user = self::requireAuth();
        
        $matchId = Request::param('match_id');
        
        // TODO: Verify and confirm match
        return ['verified' => true];
    }

    public static function claimItem(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $postId = Request::param('post_id');
        
        // TODO: Claim found item
        return ['claimed' => true];
    }

    public static function updatePost(): array
    {
        $user = self::requireAuth();
        
        $postId = Request::param('post_id');
        $body = Request::json();
        
        $status = Validator::oneOf($body, 'status', ['active', 'resolved', 'expired']);
        
        // TODO: Update lost/found post status
        return ['updated' => true];
    }

    public static function deletePost(): array
    {
        $user = self::requireAuth();
        
        $postId = Request::param('post_id');
        
        // TODO: Delete post (soft delete)
        return ['deleted' => true];
    }
}
