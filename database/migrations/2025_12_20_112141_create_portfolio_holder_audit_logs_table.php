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
        Schema::create('portfolio_holder_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leadership_position_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Admin who made the change
            $table->string('action'); // assigned, updated, signature_uploaded, status_changed, etc.
            $table->string('field_changed')->nullable();
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->text('remark'); // Mandatory justification
            $table->timestamps();
            
            $table->index(['leadership_position_id', 'created_at'], 'ph_audit_position_created_idx');
            $table->index('user_id', 'ph_audit_user_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_holder_audit_logs');
    }
};
