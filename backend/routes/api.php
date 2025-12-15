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

// Public Materials
Route::get('events/{event}/materials', [MaterialController::class, 'index']);
Route::get('materials/{material}/download', [MaterialController::class, 'download']);

// Public participant lookup by email and riwayat (history)
Route::get('participants/by-email', [ParticipantController::class, 'findByEmail']);
Route::get('participants/{participant}/riwayat', [ParticipantController::class, 'riwayat']);

// Public Attendance Check
Route::post('attendance/check', [AttendanceController::class, 'checkAttendance']);

// Public Certificate Access
Route::get('participants/{email}/certificates', [CertificateTemplateController::class, 'getParticipantCertificates']);
Route::get('certificates/{certificate}/view', [CertificateTemplateController::class, 'viewCertificate'])->where('certificate', '[0-9]+');
Route::get('certificates/{certificate}/download-public', [CertificateTemplateController::class, 'downloadCertificatePublic'])->where('certificate', '[0-9]+');

// Debug route - list all certificates
Route::get('certificates/debug/list', function() {
    $certificates = \App\Models\Certificate::with(['participant', 'event', 'template'])->get();
    return response()->json([
        'success' => true,
        'total' => $certificates->count(),
        'data' => $certificates->map(function($cert) {
            return [
                'id' => $cert->id,
                'certificate_number' => $cert->certificate_number,
                'participant_name' => $cert->participant ? $cert->participant->name : 'Unknown',
                'event_title' => $cert->event ? $cert->event->title : 'Unknown',
                'file_path' => $cert->file_path
            ];
        })
    ]);
});


/*
|--------------------------------------------------------------------------
| Protected Routes (Login Required - Admin/Panitia)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);

    // Admin Events Dashboard
    Route::get('admin/events', [EventController::class, 'adminIndex']);

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
    Route::get('participants/{participant}', [ParticipantController::class, 'show']);
    Route::put('participants/{participant}', [ParticipantController::class, 'update']);
    Route::delete('participants/{participant}', [ParticipantController::class, 'destroy']);
    Route::post('participants/{participant}/generate-pin', [ParticipantController::class, 'generatePin']);

    // Attendance (Admin only)
    Route::get('events/{event}/attendance', [AttendanceController::class, 'list']);
    Route::get('events/{eventId}/attendance/export', [AttendanceController::class, 'exportExcel']);

    // Materials
    Route::post('events/{eventId}/materials', [MaterialController::class, 'store']);
    Route::put('materials/{material}', [MaterialController::class, 'update']);
    Route::delete('materials/{material}', [MaterialController::class, 'destroy']);
    
    // Admin specific routes
    Route::get('admin/events/{eventId}/participants', function($eventId) {
        return app(\App\Http\Controllers\ParticipantController::class)->index($eventId);
    });
    Route::get('admin/events/{eventId}/attendance-pin', [AttendanceController::class, 'getPin']);
    Route::post('admin/events/{eventId}/generate-pin', [AttendanceController::class, 'generatePin']);
    Route::put('admin/events/{eventId}/attendance-pin', [AttendanceController::class, 'updatePin']);
    Route::post('admin/events/{eventId}/thumbnail', [EventController::class, 'uploadThumbnail']);

    // Certificates
    Route::post('participants/{participant}/certificate', [CertificateController::class, 'generate']);
    Route::post('participants/{participantId}/certificate/generate', [CertificateController::class, 'generateSingle']);
    Route::get('certificates/{certificate}/download', [CertificateController::class, 'download']);
    Route::post('events/{eventId}/certificates/generate-all', [CertificateController::class, 'generateAll']);
    
    // Email Certificates
    Route::post('certificates/{certificateId}/send-email', [CertificateController::class, 'sendEmail']);
    Route::post('events/{eventId}/certificates/send-bulk-email', [CertificateController::class, 'sendBulkEmail']);

    // Certificate Templates
    Route::get('certificate-templates', [CertificateTemplateController::class, 'index']);
    Route::get('certificate-templates/{templateId}/preview', [CertificateTemplateController::class, 'preview']);
    Route::post('certificate-templates', [CertificateTemplateController::class, 'store']);
    Route::put('certificate-templates/{template}', [CertificateTemplateController::class, 'update']);
    Route::delete('certificate-templates/{template}', [CertificateTemplateController::class, 'destroy']);
    Route::post('certificate-templates/{template}/generate', [CertificateTemplateController::class, 'generateCertificates']);
    Route::get('events/{eventId}/certificates', [CertificateTemplateController::class, 'getCertificates']);
    Route::post('events/{eventId}/certificates/generate-all', [CertificateTemplateController::class, 'generateAllCertificates']);
    Route::get('certificates/{certificate}/download', [CertificateTemplateController::class, 'downloadCertificate']);


    // Feedback
    Route::get('admin/events/{eventId}/feedbacks', [FeedbackController::class, 'index']);
});

// Public Feedback (no auth required)
Route::post('events/{event}/feedback', [FeedbackController::class, 'store']);