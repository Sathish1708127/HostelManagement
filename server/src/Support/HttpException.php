<?php
namespace App\Support;

use RuntimeException;

final class HttpException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly int $status = 400,
        private readonly array $details = []
    ) {
        parent::__construct($message);
    }

    public function status(): int
    {
        return $this->status;
    }

    public function details(): array
    {
        return $this->details;
    }
}
