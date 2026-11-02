<?php

namespace App\Controllers;

use App\Support\Request;
use App\Support\Validator;

final class FeeController extends ApiController
{
    public static function getStructures(): array
    {
        $user = self::requireAuth();
        
        $hostelId = (int) Request::param('hostel_id');
        $academicYear = Request::query('academic_year');
        
        // TODO: Get fee structures for hostel
        return [];
    }

    public static function createInvoice(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::OFFICE_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'student_id' => Validator::requiredInt($body, 'student_id'),
            'hostel_id' => Validator::requiredInt($body, 'hostel_id'),
            'academic_year' => Validator::requiredString($body, 'academic_year', 20),
            'items' => Validator::requiredArray($body, 'items'),
            'discount_amount' => (float) ($body['discount_amount'] ?? 0),
            'tax_amount' => (float) ($body['tax_amount'] ?? 0),
            'due_date' => Validator::requiredString($body, 'due_date', 10),
        ];
        
        // TODO: Create invoice with items
        return $validated;
    }

    public static function getInvoices(): array
    {
        $user = self::requireAuth();
        
        if (self::isStudent($user)) {
            $studentId = $user['id'];
        } else {
            $studentId = Request::query('student_id');
        }
        
        $status = Request::query('status');
        $page = self::getPage();
        $perPage = self::getPerPage();
        
        // TODO: Get invoices with optional status filter
        return [
            'items' => [],
            'meta' => ['total' => 0, 'page' => $page],
        ];
    }

    public static function recordPayment(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::OFFICE_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'student_id' => Validator::requiredInt($body, 'student_id'),
            'amount' => Validator::requiredInt($body, 'amount'),
            'payment_method' => Validator::oneOf($body, 'payment_method', ['cash', 'check', 'bank_transfer', 'card', 'upi']),
            'reference_number' => trim((string) ($body['reference_number'] ?? '')),
            'invoice_id' => isset($body['invoice_id']) ? (int) $body['invoice_id'] : null,
        ];
        
        // TODO: Record payment and allocate to invoices
        return $validated;
    }

    public static function createRefund(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::OFFICE_ROLES);
        
        $body = Request::json();
        
        $validated = [
            'payment_id' => Validator::requiredInt($body, 'payment_id'),
            'refund_amount' => Validator::requiredInt($body, 'refund_amount'),
            'reason' => Validator::requiredString($body, 'reason', 500),
        ];
        
        // TODO: Create refund request
        return $validated;
    }

    public static function approveRefund(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::SUPER_ADMIN);
        
        $refundId = Request::param('refund_id');
        
        // TODO: Approve refund and process
        return ['approved' => true];
    }

    public static function getLedger(): array
    {
        $user = self::requireAuth();
        
        $studentId = (int) Request::param('student_id');
        
        if (!self::isStaff($user) && $user['id'] != $studentId) {
            self::unauthorized();
        }
        
        // TODO: Get student's complete fee ledger
        return [];
    }

    public static function generateReceipt(): array
    {
        $user = self::requireAuth();
        
        $paymentId = Request::param('payment_id');
        
        // TODO: Generate receipt for payment
        return ['receipt_url' => ''];
    }

    public static function getDashboard(): array
    {
        $user = self::requireAuth();
        self::requireRole($user, self::OFFICE_ROLES);
        
        $hostelId = (int) Request::param('hostel_id');
        
        // TODO: Get fees dashboard with analytics
        return [
            'total_due' => 0,
            'total_collected' => 0,
            'pending_refunds' => 0,
        ];
    }
}
