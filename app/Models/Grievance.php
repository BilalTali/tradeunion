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
        'subject',
        'category', // Transfer, Pay Related, Harassment, Other
        'message',
        'status', // pending, in_progress, resolved, rejected
        'admin_response',
        'responded_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function responder()
    {
        return $this->belongsTo(User::class, 'responded_by');
    }
}
