<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class DocumentController extends ApiController
{
    public static function index(): array
    {
        $user = self::requireAuth();
        $userId = Request::param('user_id');
        
        if (!self::isStaff($user) && $user['id'] != $userId) {
            self::unauthorized();
        }
        
        $documentType = Request::query('type');
        $page = self::getPage();
        $perPage = self::getPerPage();
        
        // TODO: Get documents for user with optional type filter
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function upload(): array
    {
        $user = self::requireAuth();
        $userId = (int) Request::param('user_id');
        
        if (!self::isStaff($user) && $user['id'] != $userId) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $validated = [
            'user_id' => $userId,
            'document_type' => Validator::requiredString($body, 'document_type', 100),
            'display_name' => Validator::requiredString($body, 'display_name', 255),
            'file_path' => Validator::requiredString($body, 'file_path', 500),
            'file_size' => Validator::requiredInt($body, 'file_size'),
            'mime_type' => trim((string) ($body['mime_type'] ?? 'application/octet-stream')),
            'expiry_date' => trim((string) ($body['expiry_date'] ?? '')),
        ];
        
        // TODO: Store document metadata and create file
        return $validated;
    }

    public static function download(): void
    {
        $user = self::requireAuth();
        $documentId = Request::param('document_id');
        
        // TODO: Verify access and stream document file
        // Should set headers and output file content
    }

    public static function verify(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $documentId = Request::param('document_id');
        $body = Request::json();
        
        $verified = (bool) ($body['verified'] ?? true);
        
        // TODO: Update document verification status
        return ['verified' => $verified];
    }

    public static function delete(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $documentId = Request::param('document_id');
        
        // TODO: Soft delete document (mark as deleted)
        return ['deleted' => true];
    }

    public static function show(): array
    {
        $user = self::requireAuth();
        $documentId = Request::param('document_id');
        
        // TODO: Get document metadata
        return [];
    }
}
