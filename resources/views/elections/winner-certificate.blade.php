<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Election Winner Certificate</title>
    <style>
        @page {
            margin: 0;
            size: A4 portrait;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 0;
            margin: 0;
        }
        
        .certificate-container {
            width: 210mm;
            height: 297mm;
            background: white;
            position: relative;
            overflow: hidden;
        }
        
        /* Decorative Border */
        .certificate-border {
            position: absolute;
            top: 15mm;
            left: 15mm;
            right: 15mm;
            bottom: 15mm;
            border: 8px double #1e3a8a;
            padding: 10mm;
        }
        
        .certificate-border::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 2px solid #3b82f6;
        }
        
        /* Corner Decorations */
        .corner-decoration {
            position: absolute;
            width: 40px;
            height: 40px;
            border: 3px solid #fbbf24;
        }
        
        .corner-top-left {
            top: 20mm;
            left: 20mm;
            border-right: none;
            border-bottom: none;
        }
        
        .corner-top-right {
            top: 20mm;
            right: 20mm;
            border-left: none;
            border-bottom: none;
        }
        
        .corner-bottom-left {
            bottom: 20mm;
            left: 20mm;
            border-right: none;
            border-top: none;
        }
        
        .corner-bottom-right {
            bottom: 20mm;
            right: 20mm;
            border-left: none;
            border-top: none;
        }
        
        /* Content */
        .certificate-content {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 15mm 20mm;
        }
        
        .certificate-header {
            margin-bottom: 8mm;
        }
        
        .certificate-title {
            font-size: 20pt;
            font-weight: bold;
            color: #1e3a8a;
            letter-spacing: 3px;
            margin-bottom: 5mm;
            text-transform: uppercase;
        }
        
        .certificate-subtitle {
            font-size: 32pt;
            font-weight: bold;
            color: #dc2626;
            font-style: italic;
            margin-bottom: 8mm;
        }
        
        .award-text {
            font-size: 14pt;
            color: #374151;
            margin-bottom: 3mm;
            font-style: italic;
        }
        
        .recipient-name {
            font-size: 36pt;
            font-weight: bold;
            color: #1e3a8a;
            margin: 8mm 0;
            padding: 5mm 0;
            border-bottom: 3px solid #fbbf24;
            display: inline-block;
            min-width: 60%;
        }
        
        .position-text {
            font-size: 18pt;
            color: #059669;
            font-weight: bold;
            margin: 6mm 0;
        }
        
        .election-details {
            font-size: 13pt;
            color: #6b7280;
            margin: 4mm 0;
            line-height: 1.6;
        }
        
        .vote-stats {
            display: inline-block;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 4mm 8mm;
            border-radius: 8px;
            margin: 6mm 0;
            border: 2px solid #fbbf24;
        }
        
        .vote-percentage {
            font-size: 28pt;
            font-weight: bold;
            color: #dc2626;
        }
        
        .vote-count {
            font-size: 12pt;
            color: #374151;
            margin-top: 2mm;
        }
        
        /* Signatures */
        .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 12mm;
            padding: 0 30mm;
        }
        
        .signature-block {
            text-align: center;
            flex: 1;
        }
        
        .signature-line {
            border-top: 2px solid #1e3a8a;
            margin: 15mm 10mm 3mm;
            padding-top: 3mm;
        }
        
        .signature-title {
            font-size: 11pt;
            color: #374151;
            font-weight: bold;
        }
        
        .signature-role {
            font-size: 9pt;
            color: #6b7280;
            margin-top: 1mm;
        }
        
        /* Seal */
        .official-seal {
            position: absolute;
            bottom: 25mm;
            left: 25mm;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 4px double #dc2626;
            background: radial-gradient(circle, #fee2e2 0%, #fecaca 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8pt;
            font-weight: bold;
            color: #dc2626;
            text-align: center;
            line-height: 1.2;
            padding: 8px;
        }
        
        .certificate-date {
            position: absolute;
            bottom: 25mm;
            right: 25mm;
            font-size: 10pt;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate-border"></div>
        
        <!-- Corner Decorations -->
        <div class="corner-decoration corner-top-left"></div>
        <div class="corner-decoration corner-top-right"></div>
        <div class="corner-decoration corner-bottom-left"></div>
        <div class="corner-decoration corner-bottom-right"></div>
        
        <div class="certificate-content">
            <div class="certificate-header">
                <div class="certificate-title">{{ config('app.name', 'JKECC') }}</div>
                <div class="certificate-subtitle">Certificate of Election</div>
            </div>
            
            <div class="award-text">This certificate is proudly presented to</div>
            
            <div class="recipient-name">{{ $winner->name }}</div>
            
            <div class="position-text">{{ $result->position_title }}</div>
            
            <div class="election-details">
                For being elected as {{ $result->position_title }}<br>
                in the <strong>{{ $election->title }}</strong><br>
                {{ ucfirst($election->level) }} Level Election
            </div>
            
            <div class="vote-stats">
                <div class="vote-percentage">{{ number_format($result->vote_percentage, 1) }}%</div>
                <div class="vote-count">{{ $result->total_votes }} votes received</div>
            </div>
            
            <div class="signatures">
                <div class="signature-block">
                    <div class="signature-line">
                        <div class="signature-title">Election Commissioner</div>
                        <div class="signature-role">{{ ucfirst($election->level) }} Level</div>
                    </div>
                </div>
                
                <div class="signature-block">
                    <div class="signature-line">
                        <div class="signature-title">President</div>
                        <div class="signature-role">{{ ucfirst($election->level) }} Union</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Official Seal -->
        <div class="official-seal">
            OFFICIAL<br>SEAL
        </div>
        
        <!-- Certificate Date -->
        <div class="certificate-date">
            Certified on: {{ now()->format('d F Y') }}
        </div>
    </div>
</body>
</html>
