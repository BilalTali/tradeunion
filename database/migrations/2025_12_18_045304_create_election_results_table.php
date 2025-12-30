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
        Schema::create('election_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->constrained()->onDelete('cascade');
            $table->string('position_title');
            $table->foreignId('winner_id')->nullable()->constrained('members')->onDelete('set null');
            $table->integer('total_votes');
            $table->integer('total_voters');
            $table->decimal('vote_percentage', 5, 2);
            $table->boolean('is_certified')->default(false);
            $table->foreignId('certified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('certified_at')->nullable();
            $table->timestamps();
            
            $table->index('election_id');
            $table->index('winner_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('election_results');
    }
};
