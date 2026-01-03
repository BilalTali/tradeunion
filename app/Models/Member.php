<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'membership_id',
        'tehsil_id',
        'district_id',
        'department_id',
        'employee_category_id',
        'designation_id',
        'name',
       'parentage',
        'photo_path',
        'dob',
        'contact_email',
        'contact_phone',
        'school_name',
        'designation',
        'service_join_year',
        'union_join_date',
        'star_grade',
        'status',
        'member_level',
        // Identity Verification Fields
        'legal_full_name',
        'government_id_type',
        'government_id_number',
        'government_id_number',
        'verified_photo_path',
        'identity_verified_at',
        'verified_by',
        // Resolution tracking
        'suspension_resolution_id',
        'termination_resolution_id',
        'suspended_at',
        'suspension_reason',
        'terminated_at',
        'termination_reason',
    ];

    protected $casts = [
        'dob' => 'date',
        'union_join_date' => 'date',
        'government_id_number' => 'encrypted',
        'identity_verified_at' => 'datetime',
        'suspended_at' => 'datetime',
        'terminated_at' => 'datetime',
    ];

    /**
     * Get the suspension resolution
     */
    public function suspensionResolution()
    {
        return $this->belongsTo(Resolution::class, 'suspension_resolution_id');
    }

    /**
     * Get the termination resolution
     */
    public function terminationResolution()
    {
        return $this->belongsTo(Resolution::class, 'termination_resolution_id');
    }

    public function transfers()
    {
        return $this->hasMany(MemberTransfer::class);
    }



    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }
    
    public function tehsil()
    {
        return $this->belongsTo(Tehsil::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function employeeCategory()
    {
        return $this->belongsTo(EmployeeCategory::class);
    }

    public function designationModel()
    {
        return $this->belongsTo(Designation::class, 'designation_id');
    }

    public function commissionRoles()
    {
        return $this->hasMany(ElectionCommission::class);
    }

    public function getActiveCommissionRoleAttribute()
    {
        $role = $this->commissionRoles()
            ->whereHas('election', function($q) {
                $q->where('status', '!=', 'completed');
            })
            ->first();
            
        return $role ? ($role->role === 'chief' ? 'Chief Election Commissioner' : 'Election Commissioner') : null;
    }

    public function leadershipPositions()
    {
        return $this->hasMany(LeadershipPosition::class);
    }

    public function currentPositions()
    {
        return $this->leadershipPositions()->where('is_current', true);
    }
    
    /**
     * Check if member's identity is verified
     */
    public function isIdentityVerified(): bool
    {
        return !is_null($this->identity_verified_at);
    }
    
    /**
     * Get masked government ID number for display
     */
    public function getMaskedIdNumber(): ?string
    {
       if (!$this->government_id_number) return null;
        return '****' . substr($this->government_id_number, -4);
    }
}
