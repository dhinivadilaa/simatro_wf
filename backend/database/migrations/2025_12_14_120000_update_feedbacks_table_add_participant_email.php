<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            if (!Schema::hasColumn('feedbacks', 'participant_email')) {
                $table->string('participant_email')->after('event_id');
            }
            
            // Drop participant_id if exists (old structure)
            if (Schema::hasColumn('feedbacks', 'participant_id')) {
                $table->dropForeign(['participant_id']);
                $table->dropColumn('participant_id');
            }
            
            // Rename comment to comments if needed
            if (Schema::hasColumn('feedbacks', 'comment') && !Schema::hasColumn('feedbacks', 'comments')) {
                $table->renameColumn('comment', 'comments');
            }
        });
    }

    public function down()
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            if (Schema::hasColumn('feedbacks', 'participant_email')) {
                $table->dropColumn('participant_email');
            }
        });
    }
};