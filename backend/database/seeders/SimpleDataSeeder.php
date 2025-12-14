<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Attendance;

class SimpleDataSeeder extends Seeder
{
    public function run()
    {
        // Create sample event
        $event = Event::create([
            'category' => 'Seminar',
            'title' => 'IoT Workshop 2025',
            'description' => 'Workshop tentang IoT',
            'date' => '2025-02-15',
            'location' => 'Lab Elektro',
            'capacity' => 50,
            'registration_open' => true
        ]);

        // Create sample participants
        $participants = [
            ['name' => 'Ahmad Rizki', 'email' => 'ahmad@student.unila.ac.id', 'phone' => '081234567890'],
            ['name' => 'Sari Dewi', 'email' => 'sari@student.unila.ac.id', 'phone' => '081234567891'],
            ['name' => 'Budi Santoso', 'email' => 'budi@student.unila.ac.id', 'phone' => '081234567892']
        ];

        foreach ($participants as $participantData) {
            $participant = Participant::create([
                'event_id' => $event->id,
                'name' => $participantData['name'],
                'email' => $participantData['email'],
                'phone' => $participantData['phone']
            ]);

            // Create attendance for some participants
            if (rand(1, 10) > 5) {
                Attendance::create([
                    'participant_id' => $participant->id,
                    'event_id' => $event->id,
                    'check_in_time' => now()->subHours(rand(1, 5)),
                    'check_in_method' => 'pin'
                ]);
            }
        }

        echo "Simple sample data created successfully!\n";
    }
}