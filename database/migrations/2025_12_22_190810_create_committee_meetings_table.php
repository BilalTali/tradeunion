<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('committee_meetings', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('committee_id')->constrained()->cascadeOnDelete();
            
            // Meeting Details
            $table->datetime('meeting_date');
            $table->string('venue')->nullable();
            $table->enum('meeting_type', ['regular', 'special', 'emergency'])->default('regular');
            
            // Attendance
            $table->json('members_present')->nullable(); // Array of committee_member_ids
            $table->boolean('quorum_met')->default(false);
            
            // Agenda & Minutes
            $table->text('agenda')->nullable();
            $table->longText('minutes')->nullable();
            
            // Resolutions discussed
            $table->json('resolutions_discussed')->nullable(); // Array of resolution_ids
            
            // Chair
            $table->foreignId('chaired_by')->nullable()->constrained('committee_members')->nullOnDelete();
            
            $table->timestamps();
            
            // Index
            $table->index(['committee_id', 'meeting_date'], 'idx_committee_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committee_meetings');
    }
};
