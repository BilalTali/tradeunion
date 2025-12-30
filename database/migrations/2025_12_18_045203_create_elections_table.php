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
        Schema::create('elections', function (Blueprint $table) {
            $table->id();
            $table->enum('level', ['state', 'district', 'tehsil']);
            $table->foreignId('entity_id'); // References state_id, district_id, or tehsil_id
            $table->string('title');
            $table->text('description')->nullable();
            
            // Timeline
            $table->dateTime('nomination_start');
            $table->dateTime('nomination_end');
            $table->dateTime('voting_start');
            $table->dateTime('voting_end');
            
            // Status
            $table->enum('status', [
                'draft',
                'nominations_open',
                'nominations_closed',
                'voting_open',
                'voting_closed',
                'completed',
                'cancelled'
            ])->default('draft');
            
            // Election Type
            $table->enum('election_type', [
                'zonal_president',
                'district_president',
                'state_president'
            ])->default('zonal_president');
            
            // Eligibility Criteria (from add_eligibility_criteria_to_elections_table)
            $table->json('voting_eligibility_criteria')->nullable();
            $table->json('candidacy_eligibility_criteria')->nullable();
            
            $table->timestamps();
            
            $table->index(['level', 'entity_id']);
            $table->index('status');
            $table->index('election_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('elections');
    }
};

