<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfficeProfile extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'entity_type',
        'entity_id',
        'organization_name',
        'short_name',
        'level',
        'parent_office_id',
        'affiliation_text',
        'federation_name',
        'tagline',
        'registration_number',
        'established_date',
        // Address & Contact fields (matching migration)
        'full_address',
        'district',
        'state',
        'pin_code',
        'primary_email',
        'secondary_email',
        'contact_numbers',
        'website',
        // Branding assets
        'constitution_path',
        'primary_logo_path',
        'header_logo_path',
        'watermark_logo_path',
        'seal_path',
        'signature_path',
        // Letterhead configuration
        'header_title',
        'header_subtitle',
        'header_alignment',
        'border_style',
        'border_color',
        'primary_color',
        'secondary_color',
        'font_family',
        // Footer configuration
        'footer_line_1',
        'footer_line_2',
        'footer_line_3',
        'show_footer_separator',
        'theme_preferences',
        
        // Profile Completion
        'completion_percentage',
        'is_complete',
        'completed_at',
        
        // Meta
        'created_by',
        'updated_by',
    ];
    
    protected $casts = [
        'contact_numbers' => 'array',
        'theme_preferences' => 'array',
        'established_date' => 'date',
        'completed_at' => 'datetime',
        'is_complete' => 'boolean',
        'show_footer_separator' => 'boolean',
        'completion_percentage' => 'integer',
    ];
    
    /**
     * Polymorphic relationship to State/District/Zone
     */
    public function entity(): MorphTo
    {
        return $this->morphTo();
    }
    
    /**
     * Parent office (for hierarchy)
     */
    public function parentOffice(): BelongsTo
    {
        return $this->belongsTo(OfficeProfile::class, 'parent_office_id');
    }
    
    /**
     * Child offices
     */
    public function childOffices(): HasMany
    {
        return $this->hasMany(OfficeProfile::class, 'parent_office_id');
    }
    
    /**
     * Creator (admin who created this profile)
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    /**
     * Last updater
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    
    /**
     * Calculate completion percentage based on required and optional fields
     */
    public function calculateCompletion(): int
    {
        // Required fields (60% weight)
        $required = [
            'organization_name',
            'full_address',
            'primary_email',
            'primary_logo_path',
        ];
        
        // Optional but important fields (40% weight)
        $optional = [
            'affiliation_text',
            'tagline',
            'header_logo_path',
            'watermark_logo_path',
            'header_title',
            'footer_line_1',
            'footer_line_2',
            'contact_numbers',
            'header_subtitle',
        ];
        
        $requiredFilled = collect($required)->filter(function($field) {
            $value = $this->$field;
            return !empty($value) || (is_array($value) && count($value) > 0);
        })->count();
        
        $optionalFilled = collect($optional)->filter(function($field) {
            $value = $this->$field;
            return !empty($value) || (is_array($value) && count($value) > 0);
        })->count();
        
        $requiredWeight = 60; // Required fields = 60%
        $optionalWeight = 40; // Optional fields = 40%
        
        $percentage = 
            ($requiredFilled / count($required)) * $requiredWeight +
            ($optionalFilled / count($optional)) * $optionalWeight;
        
        return (int) round($percentage);
    }
    
    /**
     * Update completion status and mark as complete if >= 80%
     */
    public function updateCompletion(): void
    {
        $this->completion_percentage = $this->calculateCompletion();
        $this->is_complete = $this->completion_percentage >= 80;
        
        // Set completed_at timestamp on first completion
        if ($this->is_complete && !$this->completed_at) {
            $this->completed_at = now();
        }
        
        $this->saveQuietly(); // Save without triggering events
    }
    
    /**
     * Get primary logo URL
     */
    public function getPrimaryLogoUrlAttribute(): ?string
    {
        return $this->primary_logo_path 
            ? asset('storage/' . $this->primary_logo_path) 
            : null;
    }
    
    /**
     * Get header logo URL
     */
    public function getHeaderLogoUrlAttribute(): ?string
    {
        return $this->header_logo_path 
            ? asset('storage/' . $this->header_logo_path) 
            : null;
    }
    
    /**
     * Get watermark logo URL
     */
    public function getWatermarkLogoUrlAttribute(): ?string
    {
        return $this->watermark_logo_path 
            ? asset('storage/' . $this->watermark_logo_path) 
            : null;
    }
    
    /**
     * Get seal URL
     */
    public function getSealUrlAttribute(): ?string
    {
        return $this->seal_path 
            ? asset('storage/' . $this->seal_path) 
            : null;
    }
    
    /**
     * Get signature URL
     */
    public function getSignatureUrlAttribute(): ?string
    {
        return $this->signature_path 
            ? asset('storage/' . $this->signature_path) 
            : null;
    }
    
    /**
     * Check if profile is minimally usable (required fields filled)
     */
    public function isMinimallyComplete(): bool
    {
        return !empty($this->organization_name) &&
               !empty($this->full_address) &&
               !empty($this->primary_email);
    }
}
