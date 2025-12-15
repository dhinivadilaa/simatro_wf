<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'email:test {email}';
    protected $description = 'Test email configuration';

    public function handle()
    {
        $email = $this->argument('email');
        
        try {
            Mail::raw('Test email dari SIMATRO system. Konfigurasi SMTP berhasil!', function($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email SIMATRO')
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });
            
            $this->info("✅ Email test berhasil dikirim ke: {$email}");
            
        } catch (\Exception $e) {
            $this->error("❌ Gagal mengirim email: " . $e->getMessage());
        }
    }
}