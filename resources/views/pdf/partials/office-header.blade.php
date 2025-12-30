<div style="text-align: {{ $profile->header_alignment ?? 'center' }}; padding: 15px 20px; 
             border-bottom: {{ ($profile->border_style ?? 'single') === 'double' ? '3px double' : '2px solid' }} {{ $profile->border_color ?? '#000000' }}; 
             margin-bottom: 20px;
             font-family: {{ $profile->font_family ?? 'Arial' }};">
    
    @if($profile->header_logo_path)
        <div style="text-align: left;">
            <img src="{{ public_path('storage/' . $profile->header_logo_path) }}" 
                 alt="Logo" 
                 style="max-width: 100px; max-height: 80px; margin-bottom: 8px;">
        </div>
    @endif
    
    <h1 style="color: {{ $profile->primary_color ?? '#1e40af' }}; 
                font-family: {{ $profile->font_family ?? 'Arial' }}; 
                font-size: 20px;
                font-weight: bold;
                margin: 5px 0;">
        {{ $profile->header_title ?? $profile->organization_name }}
    </h1>
    
    @if($profile->header_subtitle)
        <p style="color: {{ $profile->secondary_color ?? '#075985' }}; 
                   font-size: 12px; 
                   margin: 3px 0;">
            {{ $profile->header_subtitle }}
        </p>
    @endif
    
    @if($profile->affiliation_text)
        <p style="font-size: 10px; 
                   color: #666; 
                   margin: 3px 0;
                   font-style: italic;">
            {{ $profile->affiliation_text }}
        </p>
    @endif
</div>
