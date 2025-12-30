<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\EventAttendance;
use App\Models\Member;
use App\Notifications\MeetingAbsent;
use App\Notifications\MeetingScheduled;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventAttendanceController extends Controller
{
    use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
    /**
     * Display the attendance sheet for a specific event.
     */
    public function index($postId)
    {
        $post = BlogPost::findOrFail($postId);
        
        // Security: Ensure user can manage this event
        $this->authorizeManageEvent($post);

        // Fetch eligible members based on scope & audience
        $members = $this->getEligibleMembers($post);

        // Fetch existing attendance records
        $attendance = EventAttendance::where('blog_post_id', $postId)
            ->get()
            ->keyBy('member_id');

        // Merge members with their attendance status
        $roster = $members->map(function ($member) use ($attendance) {
            $record = $attendance->get($member->id);
            return [
                'member_id' => $member->id,
                'name' => $member->name,
                'designation' => $member->designation,
                'school_name' => $member->school_name,
                'photo_url' => $member->photo_path ? asset('storage/' . $member->photo_path) : null,
                'status' => $record ? $record->status : 'pending',
                'attended_at' => $record ? $record->attended_at : null,
                'notes' => $record ? $record->notes : '',
                'notification_sent' => $record ? $record->notification_sent : false,
                'absent_notice_sent' => $record ? $record->absent_notice_sent : false,
            ];
        });

        return Inertia::render('Blog/Attendance', [
            'post' => $post,
            'roster' => $roster->values(),
        ]);
    }

    /**
     * Store/Update attendance records.
     */
    public function store(Request $request, $postId)
    {
        $post = BlogPost::findOrFail($postId);
        $this->authorizeManageEvent($post);

        $records = $request->input('attendance');

        foreach ($records as $record) {
            EventAttendance::updateOrCreate(
                [
                    'blog_post_id' => $postId,
                    'member_id' => $record['member_id'],
                ],
                [
                    'status' => $record['status'],
                    'notes' => $record['notes'] ?? null,
                    'attended_at' => $record['status'] === 'present' ? now() : null,
                ]
            );
        }

        return back()->with('success', 'Attendance updated successfully.');
    }

    /**
     * Send Notifications (Duty Slip or Absent Notice).
     */
    public function notify(Request $request, $postId)
    {
        $post = BlogPost::findOrFail($postId);
        $this->authorizeManageEvent($post);
        
        $type = $request->input('type'); // 'duty_slip' or 'absent_notice'
        $memberIds = $request->input('member_ids', []); // Optional: send to specific members only

        $query = EventAttendance::where('blog_post_id', $postId);
        
        if (!empty($memberIds)) {
            $query->whereIn('member_id', $memberIds);
        }

        if ($type === 'duty_slip') {
            // Find records that haven't received duty slip yet
             // If record doesn't exist, we need to create it first? No, we should notify eligible members.
             // Actually, simplified approach: Iterate eligible members.
             
             $eligibleMembers = $this->getEligibleMembers($post);
             if (!empty($memberIds)) {
                 $eligibleMembers = $eligibleMembers->whereIn('id', $memberIds);
             }

             foreach ($eligibleMembers as $member) {
                 // Check if already sent?
                 $record = EventAttendance::firstOrCreate([
                     'blog_post_id' => $post->id,
                     'member_id' => $member->id
                 ]);

                 if (!$record->notification_sent) {
                     // Check if member has user account to notify
                     if ($member->user) {
                         $member->user->notify(new MeetingScheduled($post));
                         $record->update(['notification_sent' => true]);
                     }
                 }
             }

             return back()->with('success', 'Duty slips sent successfully.');
        }

        if ($type === 'absent_notice') {
            $absentees = $query->where('status', 'absent')->where('absent_notice_sent', false)->get();

            foreach ($absentees as $record) {
                 if ($record->member && $record->member->user) {
                     $record->member->user->notify(new MeetingAbsent($post));
                     $record->update(['absent_notice_sent' => true]);
                 }
            }

             return back()->with('success', 'Absent notices sent successfully.');
        }

        return back()->with('error', 'Invalid notification type.');
    }

    /**
     * Helper: Get eligible members based on event scope and audience.
     */
    private function getEligibleMembers(BlogPost $post)
    {
        $query = Member::with('user')->where('status', 'active');

        // 1. Filter by Scope
        // If event_scope is stored on post
        if ($post->event_scope === 'tehsil') {
             // Filter by author's zone if needed, or if the post has a tehsil_id (it doesn't explicitly, inferred from author)
             // Assumption: The post author is the admin for that zone.
             if ($post->author && $post->author->tehsil_id) {
                 $query->where('tehsil_id', $post->author->tehsil_id);
             }
        } elseif ($post->event_scope === 'district') {
             if ($post->author && $post->author->district_id) {
                 $query->where('district_id', $post->author->district_id);
             }
        }
        // State level usually means no filter (all members) unless specified.

        // 2. Filter by Audience
        if ($post->target_audience === 'portfolio_holders') {
             $query->whereHas('leadershipPositions', function($q) {
                 $q->where('is_current', true);
             });
        }

        return $query->get();
    }

    private function authorizeManageEvent($post)
    {
        // Simple role check: Author or Super Admin
        $user = auth()->user();
        if ($user->id !== $post->author_id && $user->role !== 'super_admin' && !str_contains($user->role, 'state')) {
             abort(403, 'Unauthorized access to this event attendance.');
        }
    }

    /**
     * Show member's personal attendance history
     */
    public function myAttendance()
    {
        $user = auth()->user();
        
        // Get member record
        $member = \App\Models\Member::where('user_id', $user->id)->first();
        
        if (!$member) {
            return Inertia::render('Member/MyAttendance', [
                'records' => [],
                'message' => 'No member profile found.'
            ]);
        }
        
        // Fetch all attendance records for this member
        $records = EventAttendance::where('member_id', $member->id)
            ->with(['blogPost' => function($query) {
                $query->select('id', 'title', 'start_date', 'event_type', 'venue', 'event_scope');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($attendance) {
                return [
                    'id' => $attendance->id,
                    'status' => $attendance->status,
                    'notes' => $attendance->notes,
                    'attended_at' => $attendance->attended_at,
                    'notification_sent' => $attendance->notification_sent,
                    'absent_notice_sent' => $attendance->absent_notice_sent,
                    'event' => [
                        'id' => $attendance->blogPost->id,
                        'title' => $attendance->blogPost->title,
                        'start_date' => $attendance->blogPost->start_date,
                        'event_type' => $attendance->blogPost->event_type,
                        'venue' => $attendance->blogPost->venue,
                        'event_scope' => $attendance->blogPost->event_scope,
                    ]
                ];
            });
        
        return Inertia::render('Member/MyAttendance', [
            'records' => $records
        ]);
    }
    
    /**
     * Download Duty Slip PDF for a specific attendance record
     */
    public function downloadDutySlip($attendanceId)
    {
        $attendance = EventAttendance::with(['blogPost.organizer', 'blogPost.author', 'member'])->findOrFail($attendanceId);
        
        // Authorization: ensure this attendance belongs to the logged-in member
        if ($attendance->member->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this document.');
        }
        
        $event = $attendance->blogPost;
        $member = $attendance->member;
        
        // Determine signatory
        $signatoryData = $this->getSignatoryDataForPDF($event);
        $scopeTitle = ucfirst($event->event_scope ?? 'state');
        
        // Generate PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('notifications.duty-slip', [
            'event' => $event,
            'member' => $member,
            'organizer' => $event->organizer,
            'signatoryName' => $signatoryData['name'],
            'signatoryDesignation' => $signatoryData['designation'],
            'scopeTitle' => $scopeTitle,
        ]);
        
        return $pdf->download('Duty-Slip-' . $event->id . '-' . $member->name . '.pdf');
    }
    
    /**
     * Download Absent Notice PDF for a specific attendance record
     */
    public function downloadAbsentNotice($attendanceId)
    {
        $attendance = EventAttendance::with(['blogPost.organizer', 'blogPost.author', 'member'])->findOrFail($attendanceId);
        
        // Authorization: ensure this attendance belongs to the logged-in member
        if ($attendance->member->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this document.');
        }
        
        // Only allow downloading if member was marked absent
        if ($attendance->status !== 'absent') {
            abort(403, 'Absent notice only available for absent status.');
        }
        
        $event = $attendance->blogPost;
        $member = $attendance->member;
        
        // Determine disciplinary authority
        $signatoryData = $this->getDisciplinaryAuthorityForPDF($event);
        $scopeTitle = ucfirst($event->event_scope ?? 'state');
        
        // Generate PDF
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('notifications.absent-notice', [
            'event' => $event,
            'member' => $member,
            'signatoryName' => $signatoryData['name'],
            'signatoryDesignation' => $signatoryData['designation'],
            'scopeTitle' => $scopeTitle,
        ]);
        
        return $pdf->download('Absent-Notice-' . $event->id . '-' . $member->name . '.pdf');
    }
    
    /**
     * Helper: Get signatory data for PDF generation
     */
    private function getSignatoryDataForPDF($event): array
    {
        if ($event->organizer) {
            return [
                'name' => $event->organizer->name,
                'designation' => $event->organizer->designation,
            ];
        }
        
        $scope = $event->event_scope ?? 'state';
        $scopeMap = [
            'tehsil' => ['name' => 'Zone President', 'designation' => 'Convener, Zone Level'],
            'district' => ['name' => 'District President', 'designation' => 'Convener, District Level'],
            'state' => ['name' => 'State President', 'designation' => 'Convener, State Level'],
        ];
        
        return $scopeMap[$scope] ?? $scopeMap['state'];
    }
    
    /**
     * Helper: Get disciplinary authority for PDF generation
     */
    private function getDisciplinaryAuthorityForPDF($event): array
    {
        $scope = $event->event_scope ?? 'state';
        $scopeMap = [
            'tehsil' => ['name' => 'Zone Disciplinary Officer', 'designation' => 'Disciplinary Committee, Zone Level'],
            'district' => ['name' => 'District Disciplinary Officer', 'designation' => 'Disciplinary Committee, District Level'],
            'state' => ['name' => 'State Disciplinary Officer', 'designation' => 'Disciplinary Committee, State Level'],
        ];
        
        return $scopeMap[$scope] ?? $scopeMap['state'];
    }
}


