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
        Schema::create('office_profiles', function (Blueprint $table) {
            $table->id();
            
            // Polymorphic Relationship (ties to State/District/Zone)
            $table->string('entity_type'); // App\Models\State, App\Models\District, App\Models\Zone
            $table->unsignedBigInteger('entity_id');
            
            // Core Identity
            $table->string('organization_name');
            $table->string('short_name', 100)->nullable();
            $table->enum('level', ['state', 'district', 'tehsil']);
            $table->foreignId('parent_office_id')->nullable()->constrained('office_profiles')->onDelete('set null');
            
            // Affiliation & Constitutional Info
            $table->text('affiliation_text')->nullable();
            $table->string('federation_name')->nullable();
            $table->string('tagline')->nullable();
            $table->string('registration_number', 100)->nullable();
            $table->date('established_date')->nullable();
            
            // Address & Contact (Footer Data)
            $table->text('full_address');
            $table->string('district', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pin_code', 10)->nullable();
            $table->string('primary_email');
            $table->string('secondary_email')->nullable();
            $table->json('contact_numbers')->nullable(); // Array of phones
            $table->string('website')->nullable();
            
            // Branding Assets (File Paths in storage)
            $table->string('primary_logo_path')->nullable();
            $table->string('header_logo_path')->nullable();
            $table->string('watermark_logo_path')->nullable();
            $table->string('seal_path')->nullable();
            $table->string('signature_path')->nullable();
            
            // Letterhead Configuration
            $table->string('header_title')->nullable();
            $table->string('header_subtitle')->nullable();
            $table->enum('header_alignment', ['left', 'center', 'right'])->default('center');
            $table->enum('border_style', ['none', 'single', 'double'])->default('single');
            $table->string('border_color', 7)->default('#000000');
            $table->string('primary_color', 7)->default('#1e40af'); // Blue
            $table->string('secondary_color', 7)->default('#075985'); // Darker blue
            $table->string('font_family', 50)->default('Arial');
            
            // Footer Configuration
            $table->text('footer_line_1')->nullable(); // Address
            $table->text('footer_line_2')->nullable(); // Emails
            $table->text('footer_line_3')->nullable(); // Contacts
            $table->boolean('show_footer_separator')->default(true);
            
            // Profile Completion Tracking
            $table->integer('completion_percentage')->default(0);
            $table->boolean('is_complete')->default(false);
            $table->timestamp('completed_at')->nullable();
            
            // Meta - Track who created/updated
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index(['entity_type', 'entity_id'], 'entity_index');
            $table->index('level');
            $table->index('is_complete');
            
            // Unique constraint: One profile per entity
            $table->unique(['entity_type', 'entity_id'], 'unique_entity_profile');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office_profiles');
    }
};

