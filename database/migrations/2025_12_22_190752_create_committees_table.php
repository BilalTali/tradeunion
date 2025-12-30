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
        Schema::create('committees', function (Blueprint $table) {
            $table->id();
            
            // Basic Info
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('type', [
                'executive',
                'election_commission',
                'disciplinary',
                'finance',
                'audit',
                'custom'
            ]);
            $table->enum('level', ['tehsil', 'district', 'state']);
            $table->unsignedInteger('entity_id'); // FK to tehsils/districts/states
            
            // Constitutional Rules
            $table->integer('min_members')->default(3);
            $table->integer('max_members')->default(15);
            $table->decimal('quorum_percentage', 5, 2)->default(50.00);
            $table->decimal('voting_threshold', 5, 2)->default(50.00); // % required to pass
            
            // Tenure
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Metadata
            $table->text('description')->nullable();
            $table->text('constitutional_basis')->nullable(); // Which article/clause
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['type', 'level', 'is_active'], 'idx_type_level_active');
            $table->index(['level', 'entity_id', 'is_active'], 'idx_entity_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('committees');
    }
};

