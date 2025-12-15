<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Certificate;
use App\Services\EmailService;

class DebugEmail extends Command
{
    protected $signature = 'email:debug {certificateId}';
    protected $description = 'Debug email sending for certificate';

    public function handle()
    {
        $certificateId = $this->argument('certificateId');
        
        try {
            $certificate = Certificate::with(['participant', 'event'])->find($certificateId);
            
            if (!$certificate) {
                $this->error("Certificate with ID {$certificateId} not found");
                return;
            }
            
            $this->info("Certificate found:");
            $this->info("- ID: {$certificate->id}");
            $this->info("- Number: {$certificate->certificate_number}");
            
            if ($certificate->participant) {
                $this->info("- Participant: {$certificate->participant->name}");
                $this->info("- Email: " . ($certificate->participant->email ?: 'NO EMAIL'));
            } else {
                $this->error("- No participant found!");
            }
            
            if ($certificate->event) {
                $this->info("- Event: {$certificate->event->name}");
            } else {
                $this->error("- No event found!");
            }
            
            if ($certificate->participant && $certificate->participant->email) {
                $this->info("\nTesting email send...");
                
                $emailService = new EmailService();
                $result = $emailService->sendCertificateEmail($certificate, false);
                
                if ($result) {
                    $this->info("✅ Email sent successfully!");
                } else {
                    $this->error("❌ Email failed to send. Check logs for details.");
                }
            } else {
                $this->error("Cannot send email - no participant email found");
            }
            
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            $this->error("File: " . $e->getFile() . ":" . $e->getLine());
        }
    }
}