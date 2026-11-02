<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class FacilityBookingController extends ApiController
{
    public static function getAvailableFacilities(): array
    {
        $user = self::requireAuth();
        
        $hostelId = (int) Request::param('hostel_id');
        $date = Request::query('date');
        
        // TODO: Get facilities available on a date
        return [];
    }

    public static function checkConflict(): array
    {
        $user = self::requireAuth();
        
        $body = Request::json();
        
        $facilityId = Validator::requiredInt($body, 'facility_id');
        $date = Validator::requiredString($body, 'date', 10);
        $startTime = Validator::requiredString($body, 'start_time', 8);
        $endTime = Validator::requiredString($body, 'end_time', 8);
        
        // TODO: Check for booking conflicts
        return ['conflict' => false];
    }

    public static function bookFacility(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $validated = [
            'facility_id' => Validator::requiredInt($body, 'facility_id'),
            'booking_date' => Validator::requiredString($body, 'booking_date', 10),
            'start_time' => Validator::requiredString($body, 'start_time', 8),
            'end_time' => Validator::requiredString($body, 'end_time', 8),
            'purpose' => Validator::requiredString($body, 'purpose', 255),
            'expected_attendees' => (int) ($body['expected_attendees'] ?? 1),
        ];
        
        // TODO: Create booking and charge if applicable
        return $validated;
    }

    public static function getMyBookings(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        // TODO: Get student's facility bookings
        return [];
    }

    public static function getBookings(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $facilityId = (int) Request::param('facility_id');
        $date = Request::query('date');
        
        // TODO: Get bookings for a facility on a date
        return [];
    }

    public static function approveBooking(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $bookingId = Request::param('booking_id');
        
        // TODO: Approve facility booking
        return ['approved' => true];
    }

    public static function rejectBooking(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $bookingId = Request::param('booking_id');
        $body = Request::json();
        
        $reason = Validator::requiredString($body, 'reason', 500);
        
        // TODO: Reject booking and refund
        return ['rejected' => true];
    }

    public static function addToWaitlist(): array
    {
        $user = self::requireAuth();
        
        if (!self::isStudent($user)) {
            self::unauthorized();
        }
        
        $body = Request::json();
        
        $validated = [
            'facility_id' => Validator::requiredInt($body, 'facility_id'),
            'booking_date' => Validator::requiredString($body, 'booking_date', 10),
            'start_time' => Validator::requiredString($body, 'start_time', 8),
            'end_time' => Validator::requiredString($body, 'end_time', 8),
        ];
        
        // TODO: Add to waitlist with priority
        return $validated;
    }

    public static function recordNoShow(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::STAFF_ROLES);
        
        $bookingId = Request::param('booking_id');
        
        // TODO: Mark booking as no-show and apply charges
        return ['no_show_recorded' => true];
    }
}
