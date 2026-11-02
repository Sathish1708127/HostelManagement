<?php
namespace App\Controllers;

class HealthController
{
    public static function index()
    {
        return [
            'status' => 'ok',
            'time' => date('c')
        ];
    }
}
