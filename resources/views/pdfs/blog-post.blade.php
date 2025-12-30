<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $post->title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            color: #000;
            line-height: 1.4;
            margin: 0;
            padding: 20px 40px;
        }
        @page {
            margin: 0px; 
            margin-top: 20px;
            margin-bottom: 20px;
        /* Header Layout: 3 Columns [Logo | Text | Logo] */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px; /* More spacing */
            border-bottom: 4px solid {{ $officeProfile->primary_color ?? '#b91c1c' }}; /* Match border-b-4 */
            padding-bottom: 15px;
        }
        .header-left, .header-right {
            width: 20%; /* 20% for logos */
            vertical-align: middle;
            text-align: center;
        }
        .header-center {
            width: 60%; /* 60% for text */
            text-align: center;
            vertical-align: middle;
            padding: 0 10px;
        }
        .logo {
            width: 100px; /* Slightly larger logos */
            height: auto;
            max-height: 100px;
            object-fit: contain;
        }

        /* Typography */
        .org-title {
            font-size: 24px; /* text-2xl/3xl match */
            font-weight: bold;
            color: {{ $officeProfile->primary_color ?? '#111' }};
            text-transform: uppercase;
            line-height: 1.1;
            margin-bottom: 5px;
        }
        .org-tagline {
            font-size: 12px; /* text-sm match */
            color: {{ $officeProfile->secondary_color ?? '#4b5563' }};
            font-weight: bold;
            margin-bottom: 5px;
            font-style: italic;
        }
        
        /* Affiliation Bar Style (Inside Header) */
        .affiliation-text {
            display: inline-block;
            background-color: #fff1f2; /* Light red bg */
            color: #991b1b; /* Dark red text */
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 4px 10px;
            border-radius: 12px;
            margin-top: 5px;
        }

        /* Watermark */
        .watermark {
            position: fixed;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: auto;
            opacity: 0.15;
            z-index: -1000;
        }

        /* Ref Bar */
        .ref-bar {
            width: 100%;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 20px;
            padding: 5px 0;
            font-size: 11px;
        }
        .ref-table {
            width: 100%;
        }

        /* Title */
        .doc-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
            margin-bottom: 25px;
            color: #111;
        }

        /* Content */
        .content {
            font-size: 13px;
            text-align: justify;
            margin-bottom: 50px;
            min-height: 300px;
        }

        /* Signature */
        .signature-block {
            text-align: right;
            margin-top: 40px;
            page-break-inside: avoid;
        }
        .signatory-name {
            font-weight: bold;
            font-size: 14px;
        }
        .signatory-role {
            font-size: 11px;
            color: #374151;
        }
        /* Footer */
        .footer {
            position: fixed;
            bottom: -30px;
            left: -40px;
            right: -40px;
            height: 50px;
            text-align: center;
            font-size: 10px;
            background-color: {{ $officeProfile->primary_color ?? '#1e40af' }};
            color: #ffffff;
            padding: 10px 0;
            line-height: 1.4;
        }
        .footer-text {
            font-weight: bold;
        }
    </style>
</head>
<body>

    {{-- Footer Block (Fixed) --}}
    @if($officeProfile)
    <div class="footer">
        <div class="footer-text">
            @if($officeProfile->footer_line_1)
                {{ $officeProfile->footer_line_1 }}<br>
                @if($officeProfile->footer_line_2) {{ $officeProfile->footer_line_2 }} @endif
            @else
                Hqrs: {{ $officeProfile->full_address }}<br>
                @if($officeProfile->primary_email) Email: {{ $officeProfile->primary_email }} @endif
                @if($officeProfile->contact_numbers) | Ph: {{ is_array($officeProfile->contact_numbers) ? implode(', ', $officeProfile->contact_numbers) : $officeProfile->contact_numbers }} @endif
            @endif
        </div>
    </div>
    @endif

    @if($officeProfile)
    {{-- Header Section: 3 Columns [ Logo | Text | Logo ] --}}
    <table class="header-table">
        <tr>
            {{-- Primary Logo (Left) --}}
            <td class="header-left">
                @if($logoBase64)
                    <img class="logo" src="{{ $logoBase64 }}" alt="Logo">
                @endif
            </td>

            {{-- Center Text --}}
            <td class="header-center">
                <div class="org-title">
                    {{ $officeProfile->organization_name }}
                </div>
                @if($officeProfile->tagline)
                <div class="org-tagline">
                    {{ $officeProfile->tagline }}
                </div>
                @endif
                
                {{-- Affiliation (Dynamic) --}}
                @if($officeProfile->affiliation_text)
                <div class="affiliation-text">
                    {{ $officeProfile->affiliation_text }}
                </div>
                @endif
            </td>

            {{-- Secondary Logo (Right) --}}
            <td class="header-right">
                @if($headerLogoBase64)
                    <img class="logo" src="{{ $headerLogoBase64 }}" alt="Logo2">
                @endif
            </td>
        </tr>
    </table>

    {{-- Ref / Date Bar (Line after header) --}}
    <div class="ref-bar">
        <table class="ref-table">
            <tr>
                {{-- Date on Left --}}
                <td style="text-align: left; width: 50%;">
                    <strong>Date:</strong> {{ $post->publish_date ? \Carbon\Carbon::parse($post->publish_date)->format('d F, Y') : date('d F, Y') }}
                </td>
                {{-- Ref No on Right --}}
                <td style="text-align: right; width: 50%;">
                    <strong>Ref No:</strong> SSA/{{ strtoupper($post->category ?? 'GEN') }}/{{ $post->id }}/{{ date('Y') }}
                </td>
            </tr>
        </table>
    </div>

    {{-- Watermark --}}
    @if($watermarkBase64)
        <img class="watermark" src="{{ $watermarkBase64 }}" alt="Watermark">
    @endif
    
    @endif

    {{-- Meta / Title Section --}}
    <div class="meta-section">
        {{-- Centered Title --}}
        <div class="title-section">
            <div class="title-text">{{ $post->title }}</div>
        </div>
    </div>

    {{-- Content --}}
    <div class="content">
        {!! $post->content !!}
    </div>

    {{-- Signature Section --}}
    @if($post->author)
    <div class="signature-block">
        <div class="signatory-name">{{ $post->author->name }}</div>
        <div class="signatory-role">
            {{ $post->author->designation ?? 'Member' }}<br>
            {{ $officeProfile->organization_name }}<br>
            {{ $officeProfile->short_name ?? '' }}
        </div>
    </div>
    @endif



</body>
</html>
