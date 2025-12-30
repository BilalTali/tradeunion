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
        Schema::table('committee_members', function (Blueprint $table) {
            // Drop the old unique constraint first
            $table->dropUnique('unique_active_membership');
            
            // Drop the existing foreign key for leadership_position_id
            $table->dropForeign(['leadership_position_id']);
            
            // Drop the leadership_position_id column
            $table->dropColumn('leadership_position_id');
            
            // Recreate leadership_position_id as nullable
            $table->foreignId('leadership_position_id')->nullable()->after('committee_id')->constrained('leadership_positions')->cascadeOnDelete();
            
            // Add member_id column (can be null since old records only have leadership_position_id)
            $table->foreignId('member_id')->nullable()->after('leadership_position_id')->constrained('members')->cascadeOnDelete();
            
            // Add new unique constraint using member_id
            $table->unique(['committee_id', 'member_id'], 'unique_committee_member');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('committee_members', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique('unique_committee_member');
            
            // Drop member_id
            $table->dropForeign(['member_id']);
            $table->dropColumn('member_id');
            
            // Drop leadership_position_id
            $table->dropForeign(['leadership_position_id']);
            $table->dropColumn('leadership_position_id');
            
            // Recreate leadership_position_id as NOT nullable
            $table->foreignId('leadership_position_id')->after('committee_id')->constrained('leadership_positions')->cascadeOnDelete();
            
            // Restore the old unique constraint
            $table->unique(['committee_id', 'leadership_position_id'], 'unique_active_membership');
        });
    }
};
