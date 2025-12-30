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
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            
            // Category with 'announcement' added
            $table->enum('category', ['circular', 'statement', 'notice', 'article', 'event', 'announcement']);
            
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('publish_date')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->enum('visibility', ['public', 'members_only'])->default('members_only');
            $table->string('featured_image')->nullable();
            
            // Professional/Event Fields (from add_professional_fields_to_blog_posts)
            $table->string('event_type')->nullable(); // e.g., meeting, election
            $table->string('event_scope')->nullable(); // zone, district, state
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('venue')->nullable();
            $table->foreignId('organizer_portfolio_id')->nullable()->constrained('portfolios')->nullOnDelete();
            $table->string('priority')->default('normal'); // normal, high, urgent
            $table->dateTime('expiry_date')->nullable();
            
            $table->timestamps();
            
            $table->index('slug');
            $table->index('status');
            $table->index('category');
            $table->index('publish_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
