<?php

namespace App\Support;

class FileUploadHandler
{
    private const ALLOWED_TYPES = [
        'image' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        'document' => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'spreadsheet' => ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    ];

    private const MAX_SIZES = [
        'image' => 5 * 1024 * 1024,      // 5 MB
        'document' => 10 * 1024 * 1024,  // 10 MB
        'spreadsheet' => 10 * 1024 * 1024,
    ];

    private const UPLOAD_DIR = '/storage/uploads/';

    public static function upload(
        array $file,
        string $category = 'document',
        ?string $subdirectory = null
    ): array {
        // Validate file
        self::validateFile($file, $category);

        // Generate safe filename
        $filename = self::generateFilename($file['name']);

        // Create directory
        $uploadPath = self::getUploadPath($category, $subdirectory);
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        // Move file
        $fullPath = $uploadPath . $filename;
        if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
            throw new HttpException('Failed to save uploaded file.', 500);
        }

        return [
            'filename' => $filename,
            'path' => str_replace($_SERVER['DOCUMENT_ROOT'] ?? '', '', $fullPath),
            'mime_type' => mime_content_type($fullPath),
            'size' => filesize($fullPath),
            'url' => self::getFileUrl($fullPath),
        ];
    }

    public static function validateFile(array $file, string $category = 'document'): void
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new HttpException('File upload failed: ' . self::getUploadError($file['error']), 400);
        }

        if (!isset(self::ALLOWED_TYPES[$category])) {
            throw new HttpException('Invalid file category.', 400);
        }

        if ($file['size'] > self::MAX_SIZES[$category]) {
            throw new HttpException(
                'File too large. Maximum size: ' . self::formatBytes(self::MAX_SIZES[$category]),
                400
            );
        }

        if (!in_array($file['type'], self::ALLOWED_TYPES[$category], true)) {
            throw new HttpException('File type not allowed.', 400);
        }
    }

    public static function delete(string $filePath): bool
    {
        $fullPath = $_SERVER['DOCUMENT_ROOT'] . $filePath;
        
        if (!file_exists($fullPath)) {
            return false;
        }

        return unlink($fullPath);
    }

    public static function getFileUrl(string $filePath): string
    {
        // TODO: Generate Supabase signed URL for private file access
        return str_replace($_SERVER['DOCUMENT_ROOT'] ?? '', '', $filePath);
    }

    private static function generateFilename(string $originalName): string
    {
        $ext = pathinfo($originalName, PATHINFO_EXTENSION);
        return bin2hex(random_bytes(16)) . '.' . $ext;
    }

    private static function getUploadPath(string $category, ?string $subdirectory): string
    {
        $path = $_SERVER['DOCUMENT_ROOT'] . self::UPLOAD_DIR . $category . '/';
        if ($subdirectory) {
            $path .= trim($subdirectory, '/') . '/';
        }
        return $path;
    }

    private static function getUploadError(int $code): string
    {
        return match ($code) {
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary directory',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'File upload stopped by extension',
            default => 'Unknown upload error',
        };
    }

    private static function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
