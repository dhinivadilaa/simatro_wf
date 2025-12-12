<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Participant;
use App\Models\Attendance;
use App\Models\Certificate;
use App\Models\CertificateTemplate;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ParticipantsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This will create a few participants per event, add attendances and certificates
     * so the admin dashboard can display non-zero counts for testing.
     *
     * @return void
     */
    public function run()
    {
        $events = Event::all();

        // Ensure there is at least one certificate template to satisfy not-null constraint
        $template = null;
        if (class_exists(CertificateTemplate::class)) {
            $template = CertificateTemplate::first();
            if (!$template) {
                try {
                    $template = CertificateTemplate::create([
                        'name' => 'Default Template',
                        'design' => json_encode([]),
                    ]);
                } catch (\Exception $e) {
                    // If creation fails, we'll skip certificate creation below
                    $template = null;
                }
            }
        }

        // Indonesian names for more realistic dummy data
        $indonesianNames = [
            'Ahmad Rahman', 'Siti Nurhaliza', 'Budi Santoso', 'Dewi Sari', 'Eko Prasetyo',
            'Fitriani Kusuma', 'Gunawan Setiawan', 'Hani Lestari', 'Irfan Maulana', 'Julianti Putri',
            'Kurniawan Adi', 'Lina Marlina', 'Muhammad Rizki', 'Novi Andriani', 'Oscar Fernando',
            'Putri Amelia', 'Rudi Hartono', 'Sari Dewanti', 'Taufik Hidayat', 'Umi Kalsum',
            'Vino Pratama', 'Wati Susanti', 'Xaverius Yudi', 'Yuniarti Sari', 'Zainal Abidin'
        ];

        $participantsPerEvent = 6; // Create 6 participants per event

        foreach ($events as $event) {
            // Shuffle names to get random selection
            $shuffledNames = $indonesianNames;
            shuffle($shuffledNames);

            for ($i = 0; $i < $participantsPerEvent; $i++) {
                $name = $shuffledNames[$i];
                $nameSlug = Str::slug($name);
                $phoneNumber = '08' . rand(11, 99) . rand(10000000, 99999999);

                $p = Participant::create([
                    'event_id' => $event->id,
                    'name' => $name,
                    'email' => $nameSlug . '@gmail.com',
                    'phone' => $phoneNumber,
                    'pin' => rand(1000, 9999),
                    'registered_at' => Carbon::now()->subDays(rand(1, 14)),
                ]);

                // make first two participants attend
                if ($i <= 2) {
                    Attendance::create([
                        'participant_id' => $p->id,
                        'event_id' => $event->id,
                        'check_in_time' => Carbon::now()->subHours(rand(1, 5)),
                        'check_in_method' => 'manual',
                    ]);

                    // create certificate for attendees only if template exists
                    if ($template) {
                        Certificate::create([
                            'participant_id' => $p->id,
                            'event_id' => $event->id,
                            'template_id' => $template->id,
                            'certificate_number' => strtoupper(Str::random(8)),
                            'file_path' => null,
                        ]);
                    }
                }
            }
        }
    }
}
