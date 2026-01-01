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
        Schema::table('grievances', function (Blueprint $table) {
            $table->string('ticket_id')->unique()->after('id')->nullable(); // Unique tracking ID
            $table->date('incident_date')->after('subject')->nullable();
            $table->string('grievance_level')->after('incident_date')->nullable(); // tehsil, district, state
            $table->string('attachment_path')->after('message')->nullable();
            $table->boolean('is_declaration_accepted')->default(false)->after('attachment_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grievances', function (Blueprint $table) {
            $table->dropColumn([
                'ticket_id',
                'incident_date',
                'grievance_level',
                'attachment_path',
                'is_declaration_accepted',
            ]);
        });
    }
};
