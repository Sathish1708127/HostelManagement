<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Env;
use App\Support\HttpException;
use App\Support\Response;
use Dotenv\Dotenv;

Dotenv::createImmutable(__DIR__ . '/../')->safeLoad();

$allowedOrigin = Env::get('CORS_ALLOWED_ORIGIN', 'http://localhost:4173');
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($requestOrigin === $allowedOrigin) {
    header("Access-Control-Allow-Origin: {$allowedOrigin}");
    header('Vary: Origin');
}
header('Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$result = null;
$meta = [];
$status = 200;

try {
    require __DIR__ . '/../routes/api.php';
    Response::success($result, $status, $meta);
} catch (HttpException $exception) {
    Response::error($exception->getMessage(), $exception->status(), $exception->details());
} catch (\Throwable $exception) {
    if (Env::get('APP_ENV', 'production') === 'local') {
        Response::error('Internal server error.', 500, ['debug' => $exception->getMessage()]);
    }
    Response::error('Internal server error.', 500);
}
