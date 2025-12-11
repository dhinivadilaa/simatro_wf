<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers (Pastikan semua Controller ini sudah Anda buat)
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CertificateTemplateController;
use App\Http\Controllers\FeedbackController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// 🔑 LOGIN KHUSUS ADMIN PANEL
Route::post('admin/login', [AuthController::class, 'loginAdmin']); 

// Health Check
Route::get('health', fn() => response()->json(['status' => 'API OK']));

// Public Events & Pendaftaran
Route::get('events', [EventController::class, 'index']);
Route::get('events/{event}', [EventController::class, 'show']);
Route::post('events/{event}/participants', [ParticipantController::class, 'store']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Login Required - Admin/Panitia)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);

    // Users (Admin CRUD)
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);
    Route::post('users/{user}/role', [UserController::class, 'assignRole']);

    // Events (Admin Management)
    Route::post('events', [EventController::class, 'store']);
    Route::put('events/{event}', [EventController::class, 'update']);
    Route::delete('events/{event}', [EventController::class, 'destroy']);

    // Participants
    Route::get('events/{event}/participants', [ParticipantController::class, 'index']);
    Route::put('participants/{participant}', [ParticipantController::class, 'update']);
    Route::delete('participants/{participant}', [ParticipantController::class, 'destroy']);
    Route::post('participants/{participant}/generate-pin', [ParticipantController::class, 'generatePin']);

    // Attendance
    Route::post('attendance/check', [AttendanceController::class, 'checkAttendance']);
    Route::get('events/{event}/attendance', [AttendanceController::class, 'list']);

    // Materials
    Route::post('events/{event}/materials', [MaterialController::class, 'store']);
    Route::get('events/{event}/materials', [MaterialController::class, 'index']);
    Route::get('materials/{material}/download', [MaterialController::class, 'download']);
    Route::delete('materials/{material}', [MaterialController::class, 'destroy']);

    // Certificates
    Route::post('participants/{participant}/certificate', [CertificateController::class, 'generate']);
    Route::get('certificates/{certificate}/download', [CertificateController::class, 'download']);

    // Certificate Templates
    Route::get('certificate-templates', [CertificateTemplateController::class, 'index']);
    Route::post('certificate-templates', [CertificateTemplateController::class, 'store']);
    Route::put('certificate-templates/{template}', [CertificateTemplateController::class, 'update']);
    Route::delete('certificate-templates/{template}', [CertificateTemplateController::class, 'destroy']);

    // Feedback
    Route::post('events/{event}/feedback', [FeedbackController::class, 'store']);
    Route::get('events/{event}/feedback', [FeedbackController::class, 'index']);
});