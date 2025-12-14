<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add certificate_issued column to participants table
        Schema::table('participants', function (Blueprint $table) {
            if (!Schema::hasColumn('participants', 'certificate_issued')) {
                $table->boolean('certificate_issued')->default(false)->after('registered_at');
            }
        });

        // Add status column to events table
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'status')) {
                $table->enum('status', ['draft', 'published'])->default('draft')->after('registration_open');
            }
        });
    }

    public function down(): void
    {
        Schema::table('participants', function (Blueprint $table) {
            $table->dropColumn('certificate_issued');
        });

        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};