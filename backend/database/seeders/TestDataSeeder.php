<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Attendance;
use App\Models\CertificateTemplate;
use App\Models\Certificate;
use App\Models\Feedback;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Create test event
        $event = Event::create([
            'category' => 'Workshop',
            'title' => 'Workshop Laravel untuk Pemula',
            'topic' => 'Belajar framework Laravel dari dasar',
            'description' => 'Workshop ini akan mengajarkan dasar-dasar Laravel untuk pemula',
            'date' => '2025-01-15',
            'location' => 'Gedung Teknik Elektro Unila',
            'registration_open' => true,
            'status' => 'published',
            'absent_deadline' => '09:00:00',
            'capacity' => 50,
            'attendance_pin' => '123456'
        ]);

        // Create test participants
        $participants = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'phone' => '081234567890',
                'registered_at' => now()
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'phone' => '081234567891',
                'registered_at' => now()
            ],
            [
                'name' => 'Bob Wilson',
                'email' => 'bob@example.com',
                'phone' => '081234567892',
                'registered_at' => now()
            ]
        ];

        foreach ($participants as $participantData) {
            $participant = Participant::create([
                'event_id' => $event->id,
                'name' => $participantData['name'],
                'email' => $participantData['email'],
                'phone' => $participantData['phone'],
                'registered_at' => $participantData['registered_at']
            ]);

            // Create attendance for first 2 participants
            if ($participant->id <= 2) {
                Attendance::create([
                    'participant_id' => $participant->id,
                    'event_id' => $event->id,
                    'check_in_time' => now(),
                    'check_in_method' => 'pin'
                ]);
            }
        }

        // Create certificate template
        $template = CertificateTemplate::create([
            'event_id' => $event->id,
            'template_name' => 'Template Sertifikat Workshop Laravel',
            'file_path' => 'templates/certificate-template.pdf'
        ]);

        // Create certificates for attended participants
        $attendedParticipants = Participant::whereHas('attendances')->get();
        foreach ($attendedParticipants as $participant) {
            Certificate::create([
                'participant_id' => $participant->id,
                'event_id' => $event->id,
                'template_id' => $template->id,
                'certificate_number' => 'CERT-' . $event->id . '-' . $participant->id . '-' . time(),
                'file_path' => 'certificates/cert-' . $participant->id . '.pdf'
            ]);

            // Mark participant as having certificate
            $participant->update(['certificate_issued' => true]);
        }

        // Skip feedback for now due to table structure issues

        echo "Test data seeded successfully!\n";
    }
}