<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Member I-Card - {{ $member->membership_id }}</title>
    <style>
        @page {
            margin: 0px !important;
            padding: 0px !important;
            size: 158.74pt 243.78pt;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        html, body {
            margin: 0px !important;
            padding: 0px !important;
            width: 100%;
            height: 100%;
        }
        body {
            font-family: 'Helvetica', sans-serif;
            width: 158.74pt;
            height: 243.78pt;
            background: #fdfbf7;
        }
        .page {
            width: 158.74pt;
            height: 243.78pt;
            position: relative;
            background: #fdfbf7;
            overflow: hidden;
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: avoid;
        }

        /* Premium Color Palette */
        .header-red {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 65pt;
            background-color: {{ $officeProfile?->primary_color ?? '#b91c1c' }};
            z-index: 1;
        }
        
        .header-yellow {
            position: absolute;
            top: 65pt;
            left: 0;
            width: 100%;
            height: 12pt;
            background-color: {{ $officeProfile?->secondary_color ?? '#f59e0b' }};
            z-index: 1;
        }

        .logo-area {
            position: absolute;
            top: 10pt;
            width: 100%;
            text-align: center;
            z-index: 2;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .logo-img {
            width: 18pt;
            height: 18pt;
            margin-bottom: 2pt;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .logo-text {
            font-size: 8pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1pt;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .logo-sub {
            font-size: 4pt;
            opacity: 0.9;
            letter-spacing: 0.5pt;
        }

        .photo-container {
            position: absolute;
            top: 55pt;
            left: 57pt;
            width: 44pt;
            height: 44pt;
            z-index: 3;
            background: #e5e7eb;
            border-radius: 50%;
            border: 2.5pt solid white;
            box-shadow: 0 4pt 6pt rgba(0,0,0,0.15);
            overflow: hidden;
        }
        .photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .front-body {
            position: absolute;
            top: 105pt;
            width: 100%;
            text-align: center;
            z-index: 2;
        }
        .member-name {
            font-size: 9pt;
            font-weight: 800;
            color: {{ $officeProfile?->primary_color ?? '#b91c1c' }};
            margin-bottom: 2pt;
            text-transform: uppercase;
            letter-spacing: 0.5pt;
        }
        .member-role {
            font-size: 6pt;
            color: #c026d3;
            margin-bottom: 3pt;
            text-transform: uppercase;
            letter-spacing: 1pt;
            font-weight: 600;
        }

        .portfolio-status {
            font-size: 5pt;
            color: #059669;
            margin-bottom: 3pt;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3pt;
        }

        .star-rating {
            font-size: 8pt;
            font-family: 'DejaVu Sans', sans-serif;
            color: {{ $officeProfile?->secondary_color ?? '#f59e0b' }};
            color: {{ $officeProfile?->secondary_color ?? '#f59e0b' }};
            margin-bottom: 8pt;
            letter-spacing: 1pt;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .side-accent-left {
            position: absolute;
            top: 145pt;
            left: 0;
            width: 8pt;
            height: 40pt;
            background-color: {{ $officeProfile?->primary_color ?? '#b91c1c' }};
        }
        .side-accent-right {
            position: absolute;
            top: 145pt;
            right: 0;
            width: 8pt;
            height: 40pt;
            background-color: {{ $officeProfile?->primary_color ?? '#b91c1c' }};
        }

        .details-list {
            position: absolute;
            top: 145pt;
            left: 35pt;
            right: 35pt;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 5.5pt;
            color: #374151;
            line-height: 1.4;
        }
        .details-table td {
            padding-bottom: 2pt;
            vertical-align: top;
        }
        .label-col {
            width: 35pt;
            font-weight: bold;
            color: #111827;
        }
        .sep-col {
            width: 8pt;
            text-align: center;
            font-weight: bold;
        }

        .front-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 15pt;
            background-color: {{ $officeProfile?->secondary_color ?? '#f59e0b' }};
            overflow: hidden;
        }
        .footer-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 30%;
            height: 100%;
            background-color: {{ $officeProfile?->secondary_color ? $officeProfile?->secondary_color.'CC' : '#d97706' }}; /* Darker/alpha variant */
        }

        .office-address {
            font-size: 5.5pt;
            color: #374151;
            line-height: 1.5;
            text-align: center;
            font-weight: 500;
        }
        .office-address strong {
            color: {{ $officeProfile?->primary_color ?? '#b91c1c' }};
            font-weight: 700;
        }

        .back-body {
            position: absolute;
            top: 80pt;
            left: 20pt;
            right: 20pt;
            text-align: center;
        }
        .back-text {
            font-size: 5pt;
            color: #4b5563;
            line-height: 1.4;
            margin-bottom: 5pt;
        }
        
        .signature-area {
            margin-top: 15pt;
            text-align: center;
        }

        .barcode-area {
            position: absolute;
            bottom: 25pt;
            left: 20pt;
            right: 20pt;
            width: auto;
            text-align: center;
        }

        .watermark-img {
            position: absolute;
            top: 80pt;
            left: 39pt;
            width: 80pt;
            height: 80pt;
            opacity: 0.04;
            z-index: 0;
        }

        .lanyard-slot {
            position: absolute;
            top: 4pt;
            left: 64.37pt;
            width: 30pt;
            height: 4pt;
            border-radius: 2pt;
            background: #ffffff;
            z-index: 10;
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    @php
        $displayId = $member->membership_id;
        if (strlen($displayId) > 12) {
            $prefix = 'JK';
            $dist = isset($member->tehsil->district->name) ? strtoupper(substr($member->tehsil->district->name, 0, 3)) : 'UNK';
            $tehsil = isset($member->tehsil->name) ? strtoupper(substr($member->tehsil->name, 0, 2)) : 'TH';
            
            if (preg_match('/(\d{4})$/', $member->membership_id, $matches)) {
                $seq = $matches[1];
                $displayId = $prefix . $dist . $tehsil . $seq;
            }
        }

        // Watermark logic
        $watermarkPath = null;
        if (isset($officeProfile) && $officeProfile) {
            if ($officeProfile->watermark_logo_path && file_exists(public_path('storage/' . $officeProfile->watermark_logo_path))) {
                $watermarkPath = public_path('storage/' . $officeProfile->watermark_logo_path);
            } elseif ($officeProfile->primary_logo_path && file_exists(public_path('storage/' . $officeProfile->primary_logo_path))) {
                $watermarkPath = public_path('storage/' . $officeProfile->primary_logo_path);
            }
        }
    @endphp
    
    <!-- Front Page -->
    <div class="page" style="margin: 0; padding: 0; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: #fdfbf7;"></div>

        <!-- Watermark -->
        @if($watermarkPath)
            <img src="{{ $watermarkPath }}" class="watermark-img" alt="">
        @endif
        
        <div class="header-red"></div>
        <div class="header-yellow"></div>
        <div class="lanyard-slot"></div>

        <div class="logo-area">
            @if(isset($officeProfile) && $officeProfile && $officeProfile->primary_logo_path && file_exists(public_path('storage/' . $officeProfile->primary_logo_path)))
                <img src="{{ public_path('storage/' . $officeProfile->primary_logo_path) }}" class="logo-img" alt="Logo">
            @else
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAxTDMgNXY2YzAgNS41NSAzLjg0IDEwLjc0IDkgMTIgNS4xNi0xLjI2IDktNi40NSA5LTEyVjVsLTktNHoiLz48L3N2Zz4=" class="logo-img" alt="Default Logo">
            @endif
            <div class="logo-text">{{ $officeProfile?->organization_name ?? 'SSA Association' }}</div>
            <div class="logo-sub">{{ $officeProfile?->short_name ?? 'SSA' }}</div>
        </div>

        <div class="photo-container">
            @if($member->photo_path && file_exists(public_path('storage/' . $member->photo_path)))
                <img src="{{ public_path('storage/' . $member->photo_path) }}" class="photo" alt="Member Photo">
            @else
                <div class="photo" style="background: #cbd5e1;"></div>
            @endif
        </div>

        <div class="front-body">
            <div class="member-name">{{ Str::limit($member->name, 18) }}</div>
            <div class="member-role">{{ $member->designation ?? 'MEMBER' }}</div>
            
            @if(isset($portfolios) && !empty($portfolios))
                <div class="portfolio-status">{{ implode(' | ', array_slice($portfolios, 0, 2)) }}</div>
            @endif
            
            @if(isset($member->star_grade) && $member->star_grade > 0)
                <div class="star-rating">
                    @php
                        $filledStars = str_repeat('&#9733;', $member->star_grade);
                        $emptyStars = str_repeat('&#9734;', 5 - $member->star_grade);
                    @endphp
                    {!! $filledStars . $emptyStars !!}
                </div>
            @endif
        </div>

        <div class="side-accent-left"></div>
        <div class="side-accent-right"></div>

        <div class="details-list">
            <table class="details-table">
                <tr>
                    <td class="label-col">Card No</td>
                    <td class="sep-col">:</td>
                    <td>{{ $displayId }}</td>
                </tr>
                <tr>
                    <td class="label-col">District</td>
                    <td class="sep-col">:</td>
                    <td>{{ Str::limit($member->tehsil->district->name ?? 'N/A', 12) }}</td>
                </tr>
                <tr>
                    <td class="label-col">Tehsil</td>
                    <td class="sep-col">:</td>
                    <td>{{ Str::limit($member->tehsil->name ?? 'N/A', 12) }}</td>
                </tr>
                <tr>
                    <td class="label-col">Joined</td>
                    <td class="sep-col">:</td>
                    <td>{{ $member->union_join_date ? \Carbon\Carbon::parse($member->union_join_date)->format('d/m/Y') : 'N/A' }}</td>
                </tr>
            </table>
        </div>

        <div class="signature-area" style="position: absolute; bottom: 20pt; right: 20pt; text-align: right; z-index: 5;">
             <div style="width: 40pt; border-bottom: 1pt solid #ef4444; margin: 0 0 2pt auto;"></div>
             <div style="font-size: 4pt; color: #ef4444; font-weight: bold;">Gen. Secretary</div>
        </div>

        <div class="front-footer">
            <div class="footer-accent"></div>
        </div>
    </div>

    <!-- Back Page -->
    <div class="page" style="margin: 0; padding: 0; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: #fdfbf7;"></div>

        <!-- Watermark -->
        @if($watermarkPath)
            <img src="{{ $watermarkPath }}" class="watermark-img" alt="">
        @endif

        <div class="header-red"></div>
        <div class="header-yellow"></div>
        <div class="lanyard-slot"></div>

        <div class="logo-area">
            @if(isset($officeProfile) && $officeProfile && $officeProfile->primary_logo_path && file_exists(public_path('storage/' . $officeProfile->primary_logo_path)))
                <img src="{{ public_path('storage/' . $officeProfile->primary_logo_path) }}" class="logo-img" alt="Logo">
            @else
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAxTDMgNXY2YzAgNS41NSAzLjg0IDEwLjc0IDkgMTIgNS4xNi0xLjI2IDktNi40NSA5LTEyVjVsLTktNHoiLz48L3N2Zz4=" class="logo-img" alt="Default Logo">
            @endif
            <div class="logo-text">{{ $officeProfile?->organization_name ?? 'SSA Association' }}</div>
            <div class="logo-sub">{{ $officeProfile?->short_name ?? 'SSA' }}</div>
        </div>

        <div class="back-body">
            @if(isset($officeProfile) && $officeProfile)
                <p class="back-text" style="margin-bottom: 8pt; font-size: 4.5pt; color: #b91c1c; font-weight: 600;">
                    WARNING: If found, please return to below address or nearest Union office.<br>
                    Valid for official purposes only. Non-transferable.
                </p>
                
                <div class="office-address">
                    @if($officeProfile->footer_line_1)
                        <strong>{{ $officeProfile->footer_line_1 }}</strong><br>
                        {{ $officeProfile->footer_line_2 }}
                    @else
                        <strong>{{ $officeProfile->organization_name }}</strong><br>
                        {{ Str::limit($officeProfile->full_address, 60) }}<br>
                        @if($officeProfile->contact_numbers && count($officeProfile->contact_numbers) > 0)
                            <span style="font-size: 5pt;">Ph: {{ implode(', ', array_slice($officeProfile->contact_numbers, 0, 2)) }}</span><br>
                        @endif
                        @if($officeProfile->primary_email)
                            <span style="font-size: 5pt;">Email: {{ $officeProfile->primary_email }}</span>
                        @endif
                    @endif
                </div>
            @else
                <p class="back-text">
                    This card is the property of the Union.<br>
                    If found, please return to the nearest Union office.<br>
                    Valid for official Union purposes only.
                </p>
            @endif

            <div class="signature-area">
                <div style="width: 40pt; border-bottom: 1pt solid #374151; margin: 0 auto 2pt auto;"></div>
                <div style="font-size: 5pt; color: #374151;">Signature</div>
            </div>
        </div>

        <div class="barcode-area">
             <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text={{ $displayId }}&scale=2&height=8&includetext&paddingwidth=0&paddingheight=0" style="height: 25pt;" alt="Barcode">
        </div>

        <div class="front-footer">
            <div class="footer-accent"></div>
        </div>
    </div>
</body>
</html>