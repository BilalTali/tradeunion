<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'mobile',
        'institute',
        'residence',
        'photo_path',
        'district_id',
        'tehsil_id',
        'membership_id',
        'is_active',
        'email_verified_at',
        'star_grade',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the district that the user belongs to.
     */
    public function district()
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the tehsil that the user belongs to.
     */
    public function tehsil()
    {
        return $this->belongsTo(Tehsil::class);
    }

    /**
     * Get the member profile for the user.
     */
    public function member()
    {
        return $this->hasOne(Member::class);
    }

    /**
     * Get the grievances submitted by the user.
     */
    public function grievances()
    {
        return $this->hasMany(Grievance::class);
    }
}
