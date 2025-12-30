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
        Schema::create('event_attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_post_id')->constrained('blog_posts')->onDelete('cascade');
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'present', 'absent', 'excused'])->default('pending');
            $table->timestamp('attended_at')->nullable(); // For check-in time
            $table->text('notes')->nullable();
            $table->boolean('notification_sent')->default(false); // Duty slip sent?
            $table->boolean('absent_notice_sent')->default(false); // Absent notice sent?
            $table->timestamps();
            
            $table->index('blog_post_id');
            $table->index('member_id');
            $table->unique(['blog_post_id', 'member_id']); // One attendance record per member per event
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_attendance');
    }
};
