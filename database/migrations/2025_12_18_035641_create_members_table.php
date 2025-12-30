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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('membership_id')->unique();
            $table->foreignId('district_id')->constrained()->onDelete('restrict');
            $table->foreignId('tehsil_id')->constrained()->onDelete('restrict');
            
            // Personal Information
            $table->string('name');
            $table->string('parentage')->nullable(); // from add_parentage_to_members_table
            $table->string('legal_full_name')->nullable(); // from add_verification_fields_to_members_table
            $table->string('photo_path')->nullable();
            
            // Identity Verification (from add_verification_fields_to_members_table)
            $table->enum('government_id_type', [
                'aadhaar', 
                'pan', 
                'voter_id', 
                'driving_license',
                'passport'
            ])->nullable();
            $table->string('government_id_number')->nullable();
            $table->string('verified_photo_path')->nullable();
            $table->timestamp('identity_verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->date('dob')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            
            // Professional Information
            $table->string('school_name');
            $table->string('designation');
            $table->string('subject')->nullable();
            $table->year('service_join_year')->nullable();
            
            // Union Information
            $table->date('union_join_date');
            $table->integer('star_grade')->default(0); // from change_star_grade_default_to_zero
            $table->enum('status', ['pending', 'active', 'suspended', 'resigned', 'deceased'])->default('pending');
            $table->enum('member_level', ['member', 'tehsil', 'district', 'state'])->default('member'); // from add_member_level_to_members_table
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('district_id');
            $table->index('tehsil_id');
            $table->index('status');
            $table->index('government_id_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};

