<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});

// Log viewer untuk debug
Route::get('/logs', function () {
    $logFile = storage_path('logs/laravel.log');
    if (file_exists($logFile)) {
        $logs = file_get_contents($logFile);
        $logs = nl2br(htmlspecialchars($logs));
        return "<div style='font-family: monospace; font-size: 12px; padding: 20px;'><h3>Laravel Logs</h3><div style='background: #f5f5f5; padding: 10px; border: 1px solid #ddd;'>{$logs}</div></div>";
    }
    return "No log file found";
});