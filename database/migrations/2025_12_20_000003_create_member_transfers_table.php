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
        Schema::create('member_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            
            // From
            $table->enum('from_level', ['member', 'tehsil', 'district', 'state']);
            $table->unsignedBigInteger('from_entity_id')->nullable();
            
            // To
            $table->enum('to_level', ['member', 'tehsil', 'district', 'state']);
            $table->unsignedBigInteger('to_entity_id')->nullable();
            
            // Workflow
            $table->enum('status', ['pending', 'recommended', 'approved', 'rejected', 'completed'])->default('pending');
            $table->foreignId('initiated_by')->constrained('users');
            $table->foreignId('recommended_by')->nullable()->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            
            $table->text('reason');
            $table->text('rejection_reason')->nullable();
            $table->date('effective_date')->nullable();
            $table->date('cooling_off_until')->nullable();
            
            $table->timestamps();
            
            $table->index(['member_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_transfers');
    }
};

