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
        Schema::create('leadership_positions', function (Blueprint $table) {
            $table->id();
            $table->enum('level', ['state', 'district', 'tehsil']);
            $table->unsignedInteger('entity_id');
            $table->string('position_title'); // President, Vice President, Secretary, Treasurer, etc.
            
            // Portfolio Link (from add_portfolio_id_to_leadership_positions_table)
            $table->foreignId('portfolio_id')->nullable()->constrained('portfolios')->onDelete('set null');
            
            $table->foreignId('member_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Appointment & Authority Details (from add_authority_fields_to_leadership_positions_table)
            $table->string('appointment_order_number')->nullable();
            $table->date('appointment_date')->nullable();
            $table->string('appointing_authority')->nullable();
            
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(true);
            
            // Portfolio Activity Tracking (from extend_leadership_positions_table)
            $table->boolean('active_portfolio')->default(false);
            $table->timestamp('last_accessed_at')->nullable();
            $table->integer('action_count')->default(0);
            
            $table->boolean('is_elected')->default(false); // true if won by election, false if appointed
            $table->enum('status', ['active', 'relieved', 'suspended'])->default('active');
            
            // Signature & Authorization (from add_authority_fields_to_leadership_positions_table)
            $table->string('signature_path')->nullable();
            $table->date('signature_valid_from')->nullable();
            $table->date('signature_valid_to')->nullable();
            $table->string('seal_image_path')->nullable();
            $table->boolean('digital_signature_enabled')->default(false);
            
            // Declarations & Compliance
            $table->timestamp('portfolio_accepted_at')->nullable();
            $table->json('conflict_of_interest_declaration')->nullable();
            $table->json('election_neutrality_declaration')->nullable();
            
            // Admin Control & Audit
            $table->text('admin_remarks')->nullable();
            $table->foreignId('last_modified_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index(['level', 'entity_id', 'is_current'], 'level_entity_current_idx');
            $table->index('position_title');
            $table->index(['status', 'is_current'], 'status_current_idx');
            $table->index(['member_id', 'active_portfolio', 'is_current'], 'member_active_current_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leadership_positions');
    }
};

