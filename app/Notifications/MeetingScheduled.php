<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Barryvdh\DomPDF\Facade\Pdf;

use App\Models\BlogPost;

class MeetingScheduled extends Notification
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
        
        // Determine signatory based on event scope and organizer
        $signatoryData = $this->getSignatoryData();
        $scopeTitle = $this->getScopeTitle();
        
        // Generate PDF
        $pdf = Pdf::loadView('notifications.duty-slip', [
            'event' => $this->event,
            'member' => $notifiable,
            'organizer' => $this->event->organizer,
            'signatoryName' => $signatoryData['name'],
            'signatoryDesignation' => $signatoryData['designation'],
            'scopeTitle' => $scopeTitle,
        ]);
        
        return (new MailMessage)
                    ->subject('DUTY SLIP: ' . $this->event->title)
                    ->greeting('Respectful Salutation, ' . $notifiable->name)
                    ->line('You are hereby directed to attend the following official event:')
                    ->line('**Event:** ' . $this->event->title)
                    ->line('**Date:** ' . ($this->event->start_date ? $this->event->start_date->format('F j, Y, g:i a') : 'Date TBA'))
                    ->line('**Venue:** ' . $this->event->venue)
                    ->action('View Event Details', route('member.blog.show', $this->event->id))
                    ->line('Attendance is mandatory as per union protocols.')
                    ->line('**Please find the official Duty Slip attached as PDF.**')
                    ->line('Thank you,')
                    ->salutation('Teacher\'s Union Administration')
                    ->attachData($pdf->output(), 'Duty-Slip-' . $this->event->id . '.pdf', [
                        'mime' => 'application/pdf',
                    ]);
    }

    /**
     * Get signatory information based on event scope
     */
    private function getSignatoryData(): array
    {
        // If there's an organizer portfolio, use it
        if ($this->event->organizer) {
            return [
                'name' => $this->event->organizer->name,
                'designation' => $this->event->organizer->designation,
            ];
        }
        
        // Fallback based on event scope
        $scope = $this->event->event_scope ?? 'state';
        $scopeMap = [
            'zone' => ['name' => 'Zone President', 'designation' => 'Convener, Zone Level'],
            'district' => ['name' => 'District President', 'designation' => 'Convener, District Level'],
            'state' => ['name' => 'State President', 'designation' => 'Convener, State Level'],
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
            'type' => 'duty_slip',
            'event_id' => $this->event->id,
            'title' => 'DUTY SLIP: ' . $this->event->title,
            'message' => 'Mandatory event at ' . $this->event->venue . ' on ' . ($this->event->start_date ? $this->event->start_date->format('M j, g:i a') : 'Date TBA'),
            'link' => route('member.blog.show', $this->event->id), 
        ]; 

    }
}
