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
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            
            // Identification
            $table->string('dispute_number', 50)->unique();
            
            // What's being disputed
            $table->enum('disputed_entity_type', [
                'resolution',
                'action',
                'election',
                'transfer',
                'suspension'
            ]);
            $table->unsignedBigInteger('disputed_entity_id');
            
            // Filed by
            $table->foreignId('filed_by_member_id')->constrained('members');
            $table->datetime('filed_at')->useCurrent();
            
            // Grounds
            $table->enum('dispute_type', ['procedural', 'constitutional', 'factual', 'other']);
            $table->text('grounds');
           $table->json('evidence')->nullable();
            
            // Status
            $table->enum('status', [
                'filed',
                'under_review',
                'hearing_scheduled',
                'decided',
                'closed'
            ])->default('filed');
            
            // Resolution
            $table->foreignId('decided_by_committee_id')->nullable()->constrained('committees')->nullOnDelete();
            $table->foreignId('decision_resolution_id')->nullable()->constrained('resolutions')->nullOnDelete();
            $table->text('decision')->nullable();
            $table->datetime('decided_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['status', 'filed_at'], 'idx_status_filed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
