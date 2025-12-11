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
        // Cari role admin
        $adminRole = Role::where('name', 'admin')->first();

        // Buat akun admin default
        User::firstOrCreate(
            ['email' => 'admin@simatro.com'],
            [
                'name' => 'Default Admin',
                'password' => Hash::make('password'),
                'role_id' => $adminRole->id
            ]
        );
    }
}
