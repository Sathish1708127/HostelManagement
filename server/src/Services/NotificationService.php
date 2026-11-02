<?php

namespace App\Services;

interface NotificationAdapterInterface
{
    public function send(string $recipient, string $subject, string $message): bool;
    
    public function sendBatch(array $recipients, string $subject, string $message): array;
    
    public function isConfigured(): bool;
}

class EmailAdapter implements NotificationAdapterInterface
{
    public function send(string $recipient, string $subject, string $message): bool
    {
        if (!$this->isConfigured()) {
            return false;
        }

        $headers = [
            'From' => $_ENV['MAIL_FROM'] ?? 'noreply@hostel.local',
            'Content-Type' => 'text/html; charset=UTF-8',
        ];

        // TODO: Use mail() or SMTP library
        return mail($recipient, $subject, $message, implode("\r\n", $headers));
    }

    public function sendBatch(array $recipients, string $subject, string $message): array
    {
        $results = [];
        foreach ($recipients as $recipient) {
            $results[$recipient] = $this->send($recipient, $subject, $message);
        }
        return $results;
    }

    public function isConfigured(): bool
    {
        return !empty($_ENV['MAIL_FROM']);
    }
}

class SmsAdapter implements NotificationAdapterInterface
{
    public function send(string $recipient, string $subject, string $message): bool
    {
        if (!$this->isConfigured()) {
            return false;
        }

        // TODO: Integrate with SMS provider (Twilio, SNS, etc.)
        $phoneNumber = $this->sanitizePhone($recipient);
        
        return $this->sendViaProvider($phoneNumber, $message);
    }

    public function sendBatch(array $recipients, string $subject, string $message): array
    {
        $results = [];
        foreach ($recipients as $recipient) {
            $results[$recipient] = $this->send($recipient, $subject, $message);
        }
        return $results;
    }

    public function isConfigured(): bool
    {
        return !empty($_ENV['SMS_API_KEY']);
    }

    private function sanitizePhone(string $phone): string
    {
        return preg_replace('/[^0-9+]/', '', $phone);
    }

    private function sendViaProvider(string $phone, string $message): bool
    {
        // TODO: Implement SMS provider API call
        return true;
    }
}

class WhatsAppAdapter implements NotificationAdapterInterface
{
    public function send(string $recipient, string $subject, string $message): bool
    {
        if (!$this->isConfigured()) {
            return false;
        }

        // TODO: Integrate with WhatsApp Business API
        return $this->sendViaProvider($recipient, $subject, $message);
    }

    public function sendBatch(array $recipients, string $subject, string $message): array
    {
        $results = [];
        foreach ($recipients as $recipient) {
            $results[$recipient] = $this->send($recipient, $subject, $message);
        }
        return $results;
    }

    public function isConfigured(): bool
    {
        return !empty($_ENV['WHATSAPP_API_KEY']);
    }

    private function sendViaProvider(string $phone, string $subject, string $message): bool
    {
        // TODO: Implement WhatsApp API call
        return true;
    }
}

class NotificationService
{
    private EmailAdapter $emailAdapter;
    private SmsAdapter $smsAdapter;
    private WhatsAppAdapter $whatsappAdapter;

    public function __construct()
    {
        $this->emailAdapter = new EmailAdapter();
        $this->smsAdapter = new SmsAdapter();
        $this->whatsappAdapter = new WhatsAppAdapter();
    }

    public function sendEmail(string $recipient, string $subject, string $message): bool
    {
        return $this->emailAdapter->send($recipient, $subject, $message);
    }

    public function sendSms(string $phone, string $message): bool
    {
        return $this->smsAdapter->send($phone, '', $message);
    }

    public function sendWhatsApp(string $phone, string $subject, string $message): bool
    {
        return $this->whatsappAdapter->send($phone, $subject, $message);
    }

    public function sendMultiChannel(string $recipient, string $subject, string $message, array $channels = ['email']): array
    {
        $results = [];
        
        if (in_array('email', $channels)) {
            $results['email'] = $this->emailAdapter->send($recipient, $subject, $message);
        }
        
        if (in_array('sms', $channels)) {
            $results['sms'] = $this->smsAdapter->send($recipient, '', $message);
        }
        
        if (in_array('whatsapp', $channels)) {
            $results['whatsapp'] = $this->whatsappAdapter->send($recipient, $subject, $message);
        }

        return $results;
    }
}
