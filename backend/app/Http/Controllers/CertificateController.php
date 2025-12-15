<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Event;
use App\Models\Participant;
use App\Models\CertificateTemplate;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CertificateController extends Controller
{
    public function index()
    {
        return Certificate::with(['participant', 'event'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'participant_id' => 'required',
            'event_id' => 'required',
            'template_id' => 'required',
            'file_path' => 'required'
        ]);

        $certificate = Certificate::create([
            'participant_id' => $request->participant_id,
            'event_id' => $request->event_id,
            'template_id' => $request->template_id,
            'certificate_number' => 'CERT-' . time(),
            'file_path' => $request->file_path
        ]);

        // Send email notification
        $emailService = new EmailService();
        $emailService->sendCertificateEmail($certificate, true);

        return $certificate;
    }

    public function generateSingle($participantId)
    {
        try {
            $participant = Participant::findOrFail($participantId);
            
            // Check if participant already has certificate
            if ($participant->certificate_issued) {
                return response()->json([
                    'success' => false,
                    'message' => 'Peserta sudah memiliki sertifikat'
                ], 400);
            }

            // Get template for this event
            $template = CertificateTemplate::where('event_id', $participant->event_id)->first();
            if (!$template) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template sertifikat belum diupload untuk acara ini'
                ], 400);
            }

            // Generate certificate
            $certificate = Certificate::create([
                'participant_id' => $participant->id,
                'event_id' => $participant->event_id,
                'template_id' => $template->id,
                'certificate_number' => 'CERT-' . $participant->event_id . '-' . $participant->id . '-' . time(),
                'file_path' => 'certificates/cert-' . $participant->id . '-' . time() . '.pdf'
            ]);

            // Mark participant as having certificate
            $participant->update(['certificate_issued' => true]);
            
            // Send email notification
            $emailService = new EmailService();
            $emailService->sendCertificateEmail($certificate, true);

            return response()->json([
                'success' => true,
                'message' => 'Sertifikat berhasil dibuat dan email telah dikirim',
                'certificate' => $certificate
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat sertifikat: ' . $e->getMessage()
            ], 500);
        }
    }

    public function generateAll($eventId)
    {
        try {
            $event = Event::findOrFail($eventId);
            
            // Get template for this event
            $template = CertificateTemplate::where('event_id', $eventId)->first();
            if (!$template) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template sertifikat belum diupload untuk acara ini'
                ], 400);
            }

            // Get participants who attended but don't have certificates yet
            $attendedParticipants = Participant::where('event_id', $eventId)
                ->whereHas('attendances')
                ->where('certificate_issued', false)
                ->get();

            if ($attendedParticipants->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada peserta yang hadir atau semua sudah memiliki sertifikat'
                ], 400);
            }

            $generatedCount = 0;
            
            DB::transaction(function () use ($attendedParticipants, $eventId, $template, &$generatedCount) {
                foreach ($attendedParticipants as $participant) {
                    // Generate certificate
                    $certificate = Certificate::create([
                        'participant_id' => $participant->id,
                        'event_id' => $eventId,
                        'template_id' => $template->id,
                        'certificate_number' => 'CERT-' . $eventId . '-' . $participant->id . '-' . time(),
                        'file_path' => 'certificates/cert-' . $participant->id . '-' . time() . '.pdf'
                    ]);

                    // Mark participant as having certificate
                    $participant->update(['certificate_issued' => true]);
                    
                    // Send email notification
                    $emailService = new EmailService();
                    $emailService->sendCertificateEmail($certificate, true);
                    
                    $generatedCount++;
                }
            });

            return response()->json([
                'success' => true,
                'message' => "Berhasil membuat {$generatedCount} sertifikat",
                'generated_count' => $generatedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat sertifikat: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendEmail($certificateId)
    {
        try {
            \Log::info('Attempting to send email for certificate', ['certificate_id' => $certificateId]);
            
            $certificate = Certificate::with(['participant', 'event'])->find($certificateId);
            
            if (!$certificate) {
                \Log::warning('Certificate not found', ['certificate_id' => $certificateId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Sertifikat tidak ditemukan'
                ], 404);
            }
            
            if (!$certificate->participant) {
                \Log::warning('Participant not found for certificate', ['certificate_id' => $certificateId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Data peserta tidak ditemukan'
                ], 400);
            }
            
            if (!$certificate->participant->email) {
                \Log::warning('Participant email not found', [
                    'certificate_id' => $certificateId,
                    'participant_id' => $certificate->participant->id
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Email peserta tidak ditemukan'
                ], 400);
            }

            $emailService = new EmailService();
            $emailSent = $emailService->sendCertificateEmail($certificate, false);
            
            if ($emailSent) {
                \Log::info('Email sent successfully', [
                    'certificate_id' => $certificateId,
                    'participant_email' => $certificate->participant->email
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Email sertifikat berhasil dikirim ke ' . $certificate->participant->email
                ]);
            } else {
                \Log::error('Email service returned false', ['certificate_id' => $certificateId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengirim email. Silakan cek log untuk detail error.'
                ], 500);
            }
            
        } catch (\Exception $e) {
            \Log::error('Exception in sendEmail', [
                'certificate_id' => $certificateId,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sendBulkEmail($eventId)
    {
        try {
            $certificates = Certificate::with(['participant', 'event'])
                ->where('event_id', $eventId)
                ->whereHas('participant', function($query) {
                    $query->whereNotNull('email');
                })
                ->get();

            if ($certificates->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada sertifikat dengan email peserta yang valid'
                ], 400);
            }

            $emailService = new EmailService();
            $result = $emailService->sendBulkCertificateEmails($certificates);
            
            return response()->json([
                'success' => true,
                'message' => "Email berhasil dikirim ke {$result['success']} peserta dari {$result['total']} total",
                'details' => $result
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Certificate $certificate)
    {
        return $certificate->delete();
    }
}
