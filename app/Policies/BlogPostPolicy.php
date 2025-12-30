<?php

namespace App\Policies;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BlogPostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Everyone can view list
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BlogPost $blogPost): bool
    {
        return true; // Everyone can view individual posts
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only admins can create
        return $user->role !== 'member';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BlogPost $blogPost): bool
    {
        // Members cannot update
        if ($user->role === 'member') {
            return false;
        }

        // STRICT AUTHORIZATION: Only the post creator can edit
        // This ensures posts are read-only for other roles
        return $blogPost->author_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BlogPost $blogPost): bool
    {
        // STRICT AUTHORIZATION: Only the post creator can delete
        // This ensures posts are read-only for other roles
        return $blogPost->author_id === $user->id;
    }

    /**
     * Get user's management level
     */
    private function getUserLevel(User $user): string
    {
        if ($user->role === 'super_admin') return 'state';
        if (str_contains($user->role, 'district')) return 'district';
        if (str_contains($user->role, 'tehsil')) return 'tehsil';
        return 'tehsil';
    }

    /**
     * Check if post belongs to admin's jurisdiction
     */
    private function belongsToAdmin(User $user, BlogPost $blogPost): bool
    {
        $postScope = $blogPost->event_scope ?? 'state';
        $adminLevel = $this->getUserLevel($user);

        // For zone-level posts
        if ($postScope === 'tehsil') {
            // Check if admin is from the same zone (you may need to add tehsil_id to blog_posts)
            // For now, zone admins can only edit posts created by themselves
            return $blogPost->author_id === $user->id;
        }

        // For district-level posts
        if ($postScope === 'district') {
            if ($adminLevel === 'district') {
                // Check if admin is from the same district
                return $blogPost->author_id === $user->id;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, BlogPost $blogPost): bool
    {
        return $this->update($user, $blogPost);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, BlogPost $blogPost): bool
    {
        return $user->role === 'super_admin';
    }
}

