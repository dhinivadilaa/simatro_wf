<?php

namespace App\Mail;

use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CertificateNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $certificate;
    public $participant;
    public $event;

    public function __construct(Certificate $certificate)
    {
        $this->certificate = $certificate;
        $this->participant = $certificate->participant;
        $this->event = $certificate->event;
    }

    public function build()
    {
        return $this->subject('📜 Sertifikat ' . $this->event->name . ' Siap Diunduh!')
                    ->view('emails.certificate-notification')
                    ->with([
                        'participantName' => $this->participant->name,
                        'eventName' => $this->event->name,
                        'certificateNumber' => $this->certificate->certificate_number,
                    ]);
    }
}