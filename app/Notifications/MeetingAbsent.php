<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\BlogPost;

class MeetingAbsent extends Notification
{
    use Queueable;

    public $event;

    /**
     * Create a new notification instance.
     */
    public function __construct(BlogPost $event)
    {
        $this->event = $event;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Load organizer relationship
        $this->event->load('organizer', 'author');
        
        // Determine signatory (disciplinary authority)
        $signatoryData = $this->getDisciplinaryAuthority();
        $scopeTitle = $this->getScopeTitle();
        
        // Generate PDF
        $pdf = Pdf::loadView('notifications.absent-notice', [
            'event' => $this->event,
            'member' => $notifiable,
            'signatoryName' => $signatoryData['name'],
            'signatoryDesignation' => $signatoryData['designation'],
            'scopeTitle' => $scopeTitle,
        ]);
        
        return (new MailMessage)
                    ->subject('ABSENT NOTICE: ' . $this->event->title)
                    ->error()
                    ->greeting('Notice, ' . $notifiable->name)
                    ->line('It has been noted that you were ABSENT from the following mandatory event:')
                    ->line('**Event:** ' . $this->event->title)
                    ->line('**Date:** ' . ($this->event->start_date ? $this->event->start_date->format('F j, Y') : 'Date TBA'))
                    ->line('Please provide a valid explanation for your absence to the disciplinary committee within 3 days.')
                    ->action('View Event', route('member.blog.show', $this->event->id))
                    ->line('**Please find the official Absent Notice attached as PDF.**')
                    ->line('Failure to respond may attract disciplinary action.')
                    ->attachData($pdf->output(), 'Absent-Notice-' . $this->event->id . '.pdf', [
                        'mime' => 'application/pdf',
                    ]);
    }

    /**
     * Get disciplinary authority information based on event scope
     */
    private function getDisciplinaryAuthority(): array
    {
        $scope = $this->event->event_scope ?? 'state';
        $scopeMap = [
            'zone' => ['name' => 'Zone Disciplinary Officer', 'designation' => 'Disciplinary Committee, Zone Level'],
            'district' => ['name' => 'District Disciplinary Officer', 'designation' => 'Disciplinary Committee, District Level'],
            'state' => ['name' => 'State Disciplinary Officer', 'designation' => 'Disciplinary Committee, State Level'],
        ];
        
        return $scopeMap[$scope] ?? $scopeMap['state'];
    }
    
    /**
     * Get scope title for letterhead
     */
    private function getScopeTitle(): string
    {
        $scope = $this->event->event_scope ?? 'state';
        return ucfirst($scope);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'absent_notice',
            'title' => 'ABSENT NOTICE: ' . $this->event->title,
            'message' => 'You were marked absent for the event on ' . ($this->event->start_date ? $this->event->start_date->format('M j') : 'Date TBA') . '. Please explain.',
            'event_id' => $this->event->id,
            'color' => 'red'
        ];
    }
}
