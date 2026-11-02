<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class ParcelController extends ApiController
{
    public static function registerParcel(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $body = Request::json();
        
        $validated = [
            'student_id' => Validator::requiredInt($body, 'student_id'),
            'hostel_id' => Validator::requiredInt($body, 'hostel_id'),
            'parcel_description' => Validator::requiredString($body, 'parcel_description', 255),
            'sender_name' => Validator::requiredString($body, 'sender_name', 255),
            'sender_contact' => trim((string) ($body['sender_contact'] ?? '')),
            'parcel_weight' => isset($body['parcel_weight']) ? (float) $body['parcel_weight'] : null,
            'parcel_dimensions' => trim((string) ($body['parcel_dimensions'] ?? '')),
            'special_handling' => trim((string) ($body['special_handling'] ?? '')),
        ];
        
        // TODO: Register incoming parcel with tracking number
        return $validated;
    }

    public static function getParcels(): array
    {
        $user = self::requireAuth();
        
        $hostelId = (int) Request::param('hostel_id');
        $status = Request::query('status');
        $page = self::getPage();
        $perPage = self::getPerPage();
        
        // TODO: Get parcels for hostel with optional status filter
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function getMyParcels(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        // TODO: Get parcels for student
        return [];
    }

    public static function generatePickupOTP(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $parcelId = Request::param('parcel_id');
        
        // TODO: Generate OTP for parcel pickup
        return ['otp' => '', 'expires_in_minutes' => 15];
    }

    public static function verifyPickupOTP(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $parcelId = Request::param('parcel_id');
        $body = Request::json();
        
        $otp = Validator::requiredString($body, 'otp', 6);
        
        // TODO: Verify OTP and allow pickup
        return ['verified' => true];
    }

    public static function recordPickup(): array
    {
        $user = self::requireAuth();
        
        $parcelId = Request::param('parcel_id');
        $body = Request::json();
        
        $pickedUpBy = Validator::requiredInt($body, 'picked_up_by');
        $notes = trim((string) ($body['notes'] ?? ''));
        
        // TODO: Record parcel pickup and send notification
        return ['picked_up' => true];
    }

    public static function generateQRCode(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $parcelId = Request::param('parcel_id');
        
        // TODO: Generate QR code for parcel
        return ['qr_code' => 'data:image/png;base64,...'];
    }

    public static function scanQRCode(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $body = Request::json();
        
        $qrData = Validator::requiredString($body, 'qr_data', 255);
        
        // TODO: Scan QR and verify parcel
        return ['parcel' => []];
    }

    public static function notifyStudent(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, ['super_admin', 'security_guard']);
        
        $parcelId = Request::param('parcel_id');
        
        // TODO: Send notification to student about parcel arrival
        return ['notified' => true];
    }
}
