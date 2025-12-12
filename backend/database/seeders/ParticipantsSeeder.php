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
        $participants = [];

        foreach ($participants as $participantData) {
            Participant::create($participantData);
        }
    }
}
