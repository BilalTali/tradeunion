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
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name');
            $table->enum('level', ['tehsil', 'district', 'state']);
            $table->enum('type', ['executive', 'administrative', 'financial', 'legal', 'election_commission']);
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->text('constitutional_responsibilities')->nullable();
            $table->integer('authority_rank')->default(100);
            $table->foreignId('reports_to_portfolio_id')->nullable()->constrained('portfolios')->onDelete('set null');
            
            // Permission flags
            $table->boolean('can_assign_portfolios')->default(false);
            $table->boolean('can_initiate_transfers')->default(false);
            $table->boolean('can_approve_transfers')->default(false);
            $table->boolean('can_conduct_elections')->default(false);
            $table->boolean('can_resolve_disputes')->default(false);
            $table->boolean('is_financial_role')->default(false);
            
            // Eligibility & conflict rules (JSON)
            $table->json('eligibility_rules')->nullable();
            $table->json('conflict_flags')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['level', 'type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};

