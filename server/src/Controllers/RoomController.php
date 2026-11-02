<?php
namespace App\Controllers;

use App\Repositories\RoomRepository;
use App\Support\Request;

final class RoomController
{
    public static function index(): array
    {
        $floor = Request::query('floor');
        return RoomRepository::floorMap(
            Request::query('building'),
            $floor === null || $floor === '' ? null : (int) $floor
        );
    }
}
