<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Winner Certificate</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .certificate-container {
            padding: 60px;
        }
        .certificate {
            background: white;
            padding: 80px 60px;
            border: 15px solid #f3e8ff;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
        }
        .corner-ornament {
            position: absolute;
            font-size: 60px;
            color: #c4b5fd;
            opacity: 0.3;
        }
        .top-left { top: 10px; left: 10px; }
        .top-right { top: 10px; right: 10px; }
        .bottom-left { bottom: 10px; left: 10px; }
        .bottom-right { bottom: 10px; right: 10px; }
        
        .ornament {
            text-align: center;
            font-size: 60px;
            margin-bottom: 20px;
        }
        .title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            text-align: center;
            color: #1e40af;
            margin: 20px 0;
            font-weight: 900;
            letter-spacing: 2px;
        }
        .subtitle {
            text-align: center;
            font-size: 16px;
            color: #6b7280;
            margin: 10px 0 50px 0;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .body {
            text-align: center;
            font-size: 18px;
            line-height: 2;
            margin: 40px 0;
            color: #374151;
        }
        .name {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            color: #7c3aed;
            font-weight: 700;
            margin: 30px 0;
            padding: 20px;
            border-top: 3px double #7c3aed;
            border-bottom: 3px double #7c3aed;
        }
        .position {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .committee-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 20px;
        }
        .vote-info {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin: 30px auto;
            max-width: 400px;
            font-size: 14px;
            color: #6b7280;
        }
        .footer {
            display: table;
            width: 100%;
            margin-top: 100px;
            padding-top: 40px;
            border-top: 2px solid #e5e7eb;
        }
        .signature {
            display: table-cell;
            text-align: center;
            width: 50%;
            padding: 0 20px;
        }
        .signature-line {
            border-top: 2px solid #374151;
            margin-top: 80px;
            padding-top: 12px;
            font-size: 14px;
        }
        .signature-title {
            font-weight: 600;
            color: #1f2937;
        }
        .seal {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 100px;
            border: 3px solid #7c3aed;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            font-size: 12px;
            font-weight: 700;
            color: #7c3aed;
            text-align: center;
            line-height: 1.2;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate">
            <div class="corner-ornament top-left">❋</div>
            <div class="corner-ornament top-right">❋</div>
            <div class="corner-ornament bottom-left">❋</div>
            <div class="corner-ornament bottom-right">❋</div>
            
            <div class="ornament">🏆</div>
            
            <h1 class="title">Certificate of Election</h1>
            <p class="subtitle">{{ config('app.name') }}</p>
            
            <div class="body">
                <p style="font-size: 16px; color: #6b7280; margin-bottom: 30px;">This certifies that</p>
                
                <div class="name">{{ $candidate->member->name }}</div>
                
                <p style="font-size: 16px; color: #6b7280; margin: 30px 0 20px 0;">has been duly elected to the position of</p>
                
                <div class="position">{{ ucfirst(str_replace('_', ' ', $position)) }}</div>
                
                <p style="margin: 30px 0 10px 0;">of the</p>
                <p class="committee-name">{{ $election->committee->name }}</p>
                
                <div class="vote-info">
                    <p style="margin: 5px 0;"><strong>Votes Received:</strong> {{ number_format($voteCount) }}</p>
                    <p style="margin: 5px 0;"><strong>Election ID:</strong> {{ $election->id }}</p>
                    <p style="margin: 5px 0;"><strong>Term:</strong> {{ now()->year }}-{{ now()->year + 2 }}</p>
                </div>
                
                <p style="margin-top: 40px; font-size: 14px; color: #6b7280;">
                    Issued on: <strong>{{ now()->format('d F Y') }}</strong>
                </p>
            </div>
            
            <div class="footer">
                <div class="signature">
                    <div class="signature-line">
                        <p class="signature-title">Election Officer</p>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">Signature & Seal</p>
                    </div>
                </div>
                
                <div class="signature">
                    <div class="signature-line">
                        <p class="signature-title">Committee Chairperson</p>
                        <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">Signature & Seal</p>
                    </div>
                </div>
            </div>
            
            <div class="seal">
                <div>
                    OFFICIAL<br>SEAL
                </div>
            </div>
        </div>
    </div>
</body>
</html>
