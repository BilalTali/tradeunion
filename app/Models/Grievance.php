<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grievance extends Model
{
    use HasFactory;

    protected $table = 'grievances';

    protected $fillable = [
        'user_id',
        'ticket_id',
        'subject',
        'incident_date',
        'category', // Transfer, Pay Related, Harassment, Other
        'grievance_level', // tehsil, district, state
        'message',
        'attachment_path',
        'is_declaration_accepted',
        'status', // pending, in_progress, resolved, rejected
        'admin_response',
        'responded_by',
    ];

    public static function booted()
    {
        static::creating(function ($grievance) {
            $grievance->ticket_id = 'GRV-' . date('Ymd') . '-' . strtoupper(uniqid());
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function responder()
    {
        return $this->belongsTo(User::class, 'responded_by');
    }
}
