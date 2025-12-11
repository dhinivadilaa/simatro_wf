<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {

            // Tambah kolom sesuai kebutuhan tabel yang benar
            if (!Schema::hasColumn('events', 'category')) {
                $table->string('category')->after('id');
            }

            if (!Schema::hasColumn('events', 'title')) {
                $table->string('title')->after('category');
            }

            if (!Schema::hasColumn('events', 'topic')) {
                $table->string('topic')->nullable()->after('title');
            }

            if (!Schema::hasColumn('events', 'description')) {
                $table->text('description')->nullable()->after('topic');
            }

            if (!Schema::hasColumn('events', 'date')) {
                $table->date('date')->after('description');
            }

            if (!Schema::hasColumn('events', 'location')) {
                $table->string('location')->nullable()->after('date');
            }

            if (!Schema::hasColumn('events', 'registration_open')) {
                $table->boolean('registration_open')->default(true)->after('location');
            }

            if (!Schema::hasColumn('events', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('registration_open');
            }
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'category',
                'title',
                'topic',
                'description',
                'date',
                'location',
                'registration_open',
                'thumbnail'
            ]);
        });
    }
};
