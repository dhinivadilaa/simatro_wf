<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('events')->insert([
            // 1. Seminar Nasional EEA 2025
            [
                'category' => 'Teknik Elektro',
                'title' => 'Seminar Nasional : EEA 2025',
                'topic' => 'AI, Energi Bersih, & Literasi Digital',
                'description' => 'Seminar nasional dengan fokus pada Artificial Intelligence, energi terbarukan, dan literasi digital dalam dunia pendidikan serta industri.',
                'date' => '2025-03-10',
                'location' => 'Aula Fakultas Teknik',
                'registration_open' => true,
                'thumbnail' => 'seminar-eea-2025.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 2. Kuliah Umum Energi Terbarukan
            [
                'category' => 'Teknik Elektro',
                'title' => 'Kuliah Umum: Transformasi Energi Terbarukan',
                'topic' => 'Sistem Pembangkit & IoT Kontrol',
                'description' => 'Kuliah umum mengenai perkembangan energi terbarukan, sistem pembangkit, dan penerapan IoT dalam kontrol energi modern.',
                'date' => '2025-04-02',
                'location' => 'Ruang Sidang Utama',
                'registration_open' => true,
                'thumbnail' => 'energi-terbarukan.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 3. Workshop Pemrograman IoT Lanjutan
            [
                'category' => 'Workshop',
                'title' => 'Workshop Pemrograman IoT Lanjutan',
                'topic' => null,
                'description' => 'Workshop lanjutan pemrograman IoT menggunakan mikrokontroler dan integrasi cloud. Saat ini pendaftaran sudah ditutup.',
                'date' => '2025-02-25',
                'location' => 'Lab Komputer 2',
                'registration_open' => false,
                'thumbnail' => 'iot-advanced.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 4. Kolokium Riset Jaringan Lanjut
            [
                'category' => 'Workshop',
                'title' => 'Kolokium Riset Jaringan Lanjut',
                'topic' => 'Network Optimization & 5G',
                'description' => 'Diskusi riset mengenai optimasi jaringan modern, protokol, dan teknologi 5G.',
                'date' => '2025-05-12',
                'location' => 'Ruang Seminar 301',
                'registration_open' => true,
                'thumbnail' => 'kolokium-jaringan.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
