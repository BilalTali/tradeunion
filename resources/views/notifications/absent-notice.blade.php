<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Absent Notice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            font-size: 14px;
            line-height: 1.6;
            color: #000;
            padding: 40px 60px;
        }
        
        .letterhead {
            text-align: center;
            border-bottom: 3px double #DC143C;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .letterhead-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 10px;
            background: #DC143C;
            border-radius: 50%;
            display:flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
            font-weight: bold;
        }
        
        .letterhead h1 {
            font-size: 24px;
            color: #DC143C;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .letterhead h2 {
            font-size: 16px;
            color: #333;
            font-weight: normal;
            margin-bottom: 3px;
        }
        
        .letterhead .department {
            font-size: 13px;
            color: #666;
            font-style: italic;
        }
        
        .warning-header {
            background: linear-gradient(135deg, #DC143C 0%, #8B0000 100%);
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 30px;
            border-radius: 5px;
        }
        
        .warning-header h2 {
            font-size: 20px;
            margin-bottom: 5px;
        }
        
        .warning-header p {
            font-size: 12px;
            opacity: 0.9;
        }
        
        .ref-block {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
            font-size: 12px;
        }
        
        .ref-block div {
            flex: 1;
        }
        
        .ref-block .right {
            text-align: right;
        }
        
        .content {
            margin-bottom: 25px;
            text-align: justify;
        }
        
        .content p {
            margin-bottom: 15px;
        }
        
        .absence-details {
            background: #ffebee;
            border: 2px solid #DC143C;
            padding: 20px;
            margin: 20px 0;
        }
        
        .absence-details h3 {
            color: #DC143C;
            font-size: 16px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .absence-details table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .absence-details td {
            padding: 8px;
            border-bottom: 1px solid #ffcdd2;
        }
        
        .absence-details td:first-child {
            font-weight: bold;
            width: 35%;
        }
        
        .consequences {
            background: #fff3e0;
            border-left: 5px solid #ff6f00;
            padding: 20px;
            margin: 25px 0;
        }
        
        .consequences h4 {
            color: #e65100;
            margin-bottom: 10px;
            font-size: 15px;
        }
        
        .consequences ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        
        .consequences li {
            margin-bottom: 8px;
            color: #5d4037;
        }
        
        .action-required {
            background: #f3e5f5;
            border: 2px dashed #6a1b9a;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
        }
        
        .action-required h4 {
            color: #6a1b9a;
            margin-bottom: 10px;
        }
        
        .action-required .deadline {
            font-size: 18px;
            font-weight: bold;
            color: #c2185b;
            margin: 10px 0;
        }
        
        .signature-block {
            margin-top: 50px;
            text-align: right;
        }
        
        .signature-line {
            margin-top: 60px;
            border-top: 1px solid #000;
            width: 250px;
            margin-left: auto;
        }
        
        .signature-name {
            font-weight: bold;
            margin-top: 5px;
        }
        
        .signature-designation {
            font-size: 12px;
            color: #666;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            font-size: 11px;
            color: #666;
            text-align: center;
        }
        
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(220, 20, 60, 0.05);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="watermark">ABSENT</div>

    <div class="letterhead">
        <div class="letterhead-logo">TU</div>
        <h1>TEACHER'S UNION</h1>
        <h2>{{ $scopeTitle }} Association</h2>
        <div class="department">Disciplinary Committee</div>
    </div>

    <div class="warning-header">
        <h2>⚠️ OFFICIAL ABSENT NOTICE ⚠️</h2>
        <p>DISCIPLINARY COMMUNICATION</p>
    </div>

    <div class="ref-block">
        <div class="left">
            <strong>Notice No:</strong> TU/DC/{{ $event->id }}/{{ now()->format('Y') }}
        </div>
        <div class="right">
            <strong>Date:</strong> {{ now()->format('F j, Y') }}
        </div>
    </div>

    <div class="content">
        <p><strong>To,</strong><br>{{ $member->name }}<br>{{ $member->designation }}<br>{{ $member->school_name }}</p>
        
        <p>Dear Member,</p>
        
        <p>This communication serves as an <strong>Official Notice</strong> regarding your unauthorized absence from a mandatory union event as detailed below:</p>
    </div>

    <div class="absence-details">
        <h3>ABSENCE RECORD</h3>
        <table>
            <tr>
                <td><strong>Event Title:</strong></td>
                <td>{{ $event->title }}</td>
            </tr>
            <tr>
                <td><strong>Scheduled Date & Time:</strong></td>
                <td>{{ $event->start_date ? $event->start_date->format('l, F j, Y \a\t g:i A') : 'N/A' }}</td>
            </tr>
            <tr>
                <td><strong>Venue:</strong></td>
                <td>{{ $event->venue }}</td>
            </tr>
            <tr>
                <td><strong>Event Type:</strong></td>
                <td>{{ ucfirst($event->event_type ?? 'General Meeting') }}</td>
            </tr>
            <tr>
                <td><strong>Attendance Status:</strong></td>
                <td style="color: #c62828; font-weight: bold;">ABSENT</td>
            </tr>
            <tr>
                <td><strong>Duty Slip Issued:</strong></td>
                <td>Yes (Ref: TU/DS/{{ $event->id }}/{{ now()->format('Y') }})</td>
            </tr>
            <tr>
                <td><strong>Prior Authorization:</strong></td>
                <td style="color: #c62828;">Not Received</td>
            </tr>
        </table>
    </div>

    <div class="consequences">
        <h4>📋 VIOLATION OF UNION PROTOCOLS:</h4>
        <p>Your absence from this mandatory event constitutes a violation of the following union regulations:</p>
        <ul>
            <li>Article 12(b) - Mandatory Attendance at Official Events</li>
            <li>Section 4.3 - Member Responsibilities and Obligations</li>
            <li>Protocol 7 - Duty Slip Compliance Requirements</li>
        </ul>
        <p style="margin-top: 15px;"><strong>Note:</strong> Repeated violations may result in suspension of membership privileges or other disciplinary actions as deemed fit by the Disciplinary Committee.</p>
    </div>

    <div class="action-required">
        <h4>📝 IMMEDIATE ACTION REQUIRED</h4>
        <p>You are hereby directed to submit a written explanation for your absence to the Disciplinary Committee.</p>
        <div class="deadline">Within 3 Working Days</div>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">Failure to respond may result in further disciplinary action.</p>
    </div>

    <div class="content">
        <p>Please submit your explanation via:</p>
        <ul style="margin-left: 30px; margin-bottom: 15px;">
            <li>Email to: disciplinary.{{ strtolower($event->event_scope ?? 'state') }}@teachersunion.org</li>
            <li>In person at the {{ ucfirst($event->event_scope ?? 'State') }} Union Office</li>
        </ul>
        
        <p>This notice is issued in accordance with the Union Constitution and Standing Orders.</p>
    </div>

    <div class="signature-block">
        <p><strong>For Disciplinary Committee,</strong></p>
        <div class="signature-line"></div>
        <div class="signature-name">{{ $signatoryName }}</div>
        <div class="signature-designation">{{ $signatoryDesignation }}</div>
        <div class="signature-designation">{{ ucfirst($event->event_scope ?? 'State') }} Level</div>
    </div>

    <div class="footer">
        <strong>CONFIDENTIAL:</strong> This is an official disciplinary communication. Unauthorized disclosure may result in additional penalties.<br>
        Auto-generated on {{ now()->format('F j, Y \a\t g:i A') }}
    </div>
</body>
</html>
