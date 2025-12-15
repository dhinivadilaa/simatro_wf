<?php

namespace App\Services;

use App\Models\Certificate;
use App\Mail\CertificateGenerated;
use App\Mail\CertificateNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    public function sendCertificateEmail(Certificate $certificate, $isNewCertificate = true)
    {
        try {
            // Load relationships if not already loaded
            if (!$certificate->relationLoaded('participant')) {
                $certificate->load('participant');
            }
            if (!$certificate->relationLoaded('event')) {
                $certificate->load('event');
            }
            
            $participant = $certificate->participant;
            
            if (!$participant) {
                Log::warning('Cannot send certificate email: participant not found', [
                    'certificate_id' => $certificate->id
                ]);
                return false;
            }
            
            if (!$participant->email) {
                Log::warning('Cannot send certificate email: participant email not found', [
                    'certificate_id' => $certificate->id,
                    'participant_id' => $participant->id,
                    'participant_name' => $participant->name
                ]);
                return false;
            }

            // Pilih template email berdasarkan apakah sertifikat baru atau sudah ada
            $mailClass = $isNewCertificate ? new CertificateGenerated($certificate) : new CertificateNotification($certificate);
            
            Mail::to($participant->email)->send($mailClass);
            
            Log::info('Certificate email sent successfully', [
                'certificate_id' => $certificate->id,
                'participant_email' => $participant->email,
                'participant_name' => $participant->name,
                'email_type' => $isNewCertificate ? 'new_certificate' : 'notification'
            ]);
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Failed to send certificate email', [
                'certificate_id' => $certificate->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return false;
        }
    }

    public function sendBulkCertificateEmails($certificates)
    {
        $successCount = 0;
        $failCount = 0;

        foreach ($certificates as $certificate) {
            if ($this->sendCertificateEmail($certificate, false)) {
                $successCount++;
            } else {
                $failCount++;
            }
        }

        Log::info('Bulk certificate emails processed', [
            'total' => count($certificates),
            'success' => $successCount,
            'failed' => $failCount
        ]);

        return [
            'total' => count($certificates),
            'success' => $successCount,
            'failed' => $failCount
        ];
    }
}