<div style="padding: 12px 20px; 
             margin-top: 30px;
             border-top: {{ ($profile->show_footer_separator ?? true) ? '1px solid ' . ($profile->border_color ?? '#000000') : 'none' }}; 
             font-size: 9px; 
             color: #555; 
             text-align: center;
             font-family: {{ $profile->font_family ?? 'Arial' }};">
    
    @if($profile->footer_line_1)
        <p style="margin: 2px 0;">{{ $profile->footer_line_1 }}</p>
    @endif
    
    @if($profile->footer_line_2)
        <p style="margin: 2px 0;">{{ $profile->footer_line_2 }}</p>
    @endif
    
    @if($profile->footer_line_3)
        <p style="margin: 2px 0;">{{ $profile->footer_line_3 }}</p>
    @endif
    
    @if($profile->website)
        <p style="margin: 4px 0 0 0;">
            <a href="{{ $profile->website }}" style="color: {{ $profile->primary_color ?? '#1e40af' }};">
                {{ $profile->website }}
            </a>
        </p>
    @endif
</div>
