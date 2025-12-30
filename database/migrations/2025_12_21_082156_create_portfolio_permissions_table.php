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
        Schema::create('portfolio_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->cascadeOnDelete();
            $table->string('permission_key', 100); // e.g., 'election.create', 'candidate.approve'
            $table->string('resource_type', 50)->nullable(); // 'election', 'member', 'finance', etc.
            $table->boolean('can_read')->default(false);
            $table->boolean('can_write')->default(false);
            $table->boolean('can_delete')->default(false);
            $table->boolean('can_execute')->default(false); // For actions like 'open_voting'
            $table->json('constraints')->nullable(); // Level restrictions, time-based limits, etc.
            $table->text('description')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->unique(['portfolio_id', 'permission_key'], 'portfolio_permission_unique');
            $table->index('permission_key');
            $table->index('resource_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_permissions');
    }
};
