<?php
use App\Controllers\BedAssignmentController;
use App\Controllers\DashboardController;
use App\Controllers\HealthController;
use App\Controllers\ResidentController;
use App\Controllers\RoomController;
use App\Middleware\AuthMiddleware;
use App\Support\HttpException;

$path = rtrim($uri, '/') ?: '/';

if ($method === 'GET' && $path === '/api/v1/health') {
    $result = HealthController::index();
    $status = 200;
    return;
}

$user = AuthMiddleware::authenticate();

if ($method === 'GET' && $path === '/api/v1/me') {
    $result = $user;
    $status = 200;
    return;
}

if ($method === 'GET' && $path === '/api/v1/dashboard') {
    $result = DashboardController::index($user);
    $status = 200;
    return;
}

if ($method === 'GET' && $path === '/api/v1/residents') {
    $response = ResidentController::index($user);
    $result = $response['items'];
    $meta = $response['meta'];
    $status = 200;
    return;
}

if ($method === 'POST' && $path === '/api/v1/residents') {
    $result = ResidentController::store($user);
    $status = 201;
    return;
}

if ($method === 'GET' && $path === '/api/v1/rooms') {
    $result = RoomController::index();
    $status = 200;
    return;
}

if ($method === 'POST' && $path === '/api/v1/bed-assignments') {
    $result = BedAssignmentController::store($user);
    $status = 201;
    return;
}

throw new HttpException('Endpoint not found.', 404);
