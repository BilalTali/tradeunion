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
        Schema::table('elections', function (Blueprint $table) {
            $table->integer('eligible_voters_count')->default(0)->after('voting_eligibility_criteria');
            $table->integer('eligible_candidates_count')->default(0)->after('candidacy_eligibility_criteria');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('elections', function (Blueprint $table) {
            $table->dropColumn(['eligible_voters_count', 'eligible_candidates_count']);
        });
    }
};
