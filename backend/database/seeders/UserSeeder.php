<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Cari role admin dan panitia
        $adminRole = Role::where('name', 'admin')->first();
        $panitiaRole = Role::where('name', 'panitia')->first();

        // Buat akun admin default
        User::firstOrCreate(
            ['email' => 'admin@simatro.com'],
            [
                'name' => 'Default Admin',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id
            ]
        );

        // Buat akun panitia default
        User::firstOrCreate(
            ['email' => 'panitia@simatro.com'],
            [
                'name' => 'Default Panitia',
                'password' => Hash::make('123456'),
                'role_id' => $panitiaRole->id
            ]
        );
    }
}
