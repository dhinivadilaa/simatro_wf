<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Material;
use App\Models\Attendance;
use App\Models\Feedback;

class SampleDataSeeder extends Seeder
{
    public function run()
    {
        // Create sample event
        $event = Event::create([
            'category' => 'Seminar',
            'title' => 'IoT Workshop',
            'topic' => 'Smart City IoT',
            'description' => 'Workshop IoT untuk Smart City',
            'date' => '2025-02-15',
            'location' => 'Lab Elektro',
            'capacity' => 100,
            'registration_open' => true,
            'status' => 'published',
            'attendance_pin' => 'IOT25'
        ]);

        // Create sample participants
        $participants = [
            ['name' => 'Ahmad Rizki', 'email' => 'ahmad.rizki@student.unila.ac.id', 'phone' => '081234567890'],
            ['name' => 'Sari Dewi', 'email' => 'sari.dewi@student.unila.ac.id', 'phone' => '081234567891'],
            ['name' => 'Budi Santoso', 'email' => 'budi.santoso@student.unila.ac.id', 'phone' => '081234567892'],
            ['name' => 'Maya Sari', 'email' => 'maya.sari@student.unila.ac.id', 'phone' => '081234567893'],
            ['name' => 'Doni Pratama', 'email' => 'doni.pratama@student.unila.ac.id', 'phone' => '081234567894']
        ];

        foreach ($participants as $participantData) {
            $participant = Participant::create([
                'event_id' => $event->id,
                'name' => $participantData['name'],
                'email' => $participantData['email'],
                'phone' => $participantData['phone'],
                'pin' => strtoupper(substr(md5($participantData['email']), 0, 8))
            ]);

            // Create attendance for some participants
            if (rand(1, 10) > 3) {
                Attendance::create([
                    'participant_id' => $participant->id,
                    'event_id' => $event->id,
                    'check_in_time' => now()->subHours(rand(1, 5)),
                    'check_in_method' => 'pin'
                ]);

                // Skip feedback for now
            }
        }

        // Create sample materials
        Material::create([
            'event_id' => $event->id,
            'title' => 'Slide Presentasi IoT',
            'filename' => 'iot-presentation.pdf',
            'file_path' => 'materials/iot-presentation.pdf',
            'file_size' => 2048000
        ]);

        Material::create([
            'event_id' => $event->id,
            'title' => 'Panduan Praktikum IoT',
            'filename' => 'iot-lab-guide.pdf',
            'file_path' => 'materials/iot-lab-guide.pdf',
            'file_size' => 1024000
        ]);

        echo "Sample data created successfully!\n";
    }
}