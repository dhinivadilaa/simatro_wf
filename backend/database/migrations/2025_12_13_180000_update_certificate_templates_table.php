<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        if (!Schema::hasColumn('certificate_templates', 'content')) {
            Schema::table('certificate_templates', function (Blueprint $table) {
                $table->text('content')->nullable()->after('template_name');
            });
        }
    }

    public function down(): void {
        if (Schema::hasColumn('certificate_templates', 'content')) {
            Schema::table('certificate_templates', function (Blueprint $table) {
                $table->dropColumn('content');
            });
        }
    }
};