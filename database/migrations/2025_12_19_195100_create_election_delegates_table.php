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
        Schema::create('election_delegates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->constrained()->onDelete('cascade');
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->enum('delegate_type', [
                'zonal_president',
                'district_president',
                'zone_nominated',
                'district_nominated',
                'portfolio_holder',
                'criteria_based'  // NEW: Added for criteria-based eligibility
            ]);
            $table->foreignId('nominated_by')->nullable()->constrained('members')->onDelete('set null');
            $table->timestamps();
            
            $table->unique(['election_id', 'member_id']);
            $table->index('election_id');
            $table->index('delegate_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('election_delegates');
    }
};
