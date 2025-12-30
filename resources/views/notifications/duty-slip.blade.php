<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Official Duty Slip</title>
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
            border-bottom: 3px double #8B0000;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .letterhead-logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 10px;
            background: #8B0000;
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
            color: #8B0000;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .letterhead h2 {
            font-size: 16px;
            color: #333;
            font-weight: normal;
            margin-bottom: 3px;
        }
        
        .letterhead .scope {
            font-size: 14px;
            color: #666;
            text-transform: capitalize;
        }
        
        .ref-block {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            font-size: 12px;
        }
        
        .ref-block div {
            flex: 1;
        }
        
        .ref-block .right {
            text-align: right;
        }
        
        .document-title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 25px;
            color: #8B0000;
        }
        
        .content {
            margin-bottom: 30px;
            text-align: justify;
        }
        
        .content p {
            margin-bottom: 15px;
        }
        
        .event-details {
            background: #f9f9f9;
            border: 2px solid #8B0000;
            padding: 20px;
            margin: 20px 0;
        }
        
        .event-details h3 {
            color: #8B0000;
            font-size: 16px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .event-details table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .event-details td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        
        .event-details td:first-child {
            font-weight: bold;
            width: 30%;
        }
        
        .mandate {
            background: #fff9e6;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
            font-style: italic;
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
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="letterhead-logo">TU</div>
        <h1>TEACHER'S UNION</h1>
        <h2>{{ $scopeTitle }} Association</h2>
        <div class="scope">{{ ucfirst($event->event_scope ?? 'State') }} Level</div>
    </div>

    <div class="ref-block">
        <div class="left">
            <strong>Ref No:</strong> TU/DS/{{ $event->id }}/{{ now()->format('Y') }}
        </div>
        <div class="right">
            <strong>Date:</strong> {{ now()->format('F j, Y') }}
        </div>
    </div>

    <div class="document-title">
        OFFICIAL DUTY SLIP
    </div>

    <div class="content">
        <p><strong>To,</strong><br>{{ $member->name }}<br>{{ $member->designation }}<br>{{ $member->school_name }}</p>
        
        <p>Dear Colleague,</p>
        
        <p>In pursuance of the powers vested under the Union Constitution and in the interest of organizational effectiveness, you are hereby directed to attend the following official event:</p>
    </div>

    <div class="event-details">
        <h3>EVENT DETAILS</h3>
        <table>
            <tr>
                <td><strong>Event Title:</strong></td>
                <td>{{ $event->title }}</td>
            </tr>
            <tr>
                <td><strong>Date & Time:</strong></td>
                <td>{{ $event->start_date ? $event->start_date->format('l, F j, Y \a\t g:i A') : 'To Be Announced' }}</td>
            </tr>
            @if($event->end_date)
            <tr>
                <td><strong>Ending On:</strong></td>
                <td>{{ $event->end_date->format('l, F j, Y \a\t g:i A') }}</td>
            </tr>
            @endif
            <tr>
                <td><strong>Venue:</strong></td>
                <td>{{ $event->venue }}</td>
            </tr>
            <tr>
                <td><strong>Event Type:</strong></td>
                <td>{{ ucfirst($event->event_type ?? 'General Meeting') }}</td>
            </tr>
            @if($organizer)
            <tr>
                <td><strong>Organized By:</strong></td>
                <td>{{ $organizer->name }} ({{ $organizer->designation }})</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="mandate">
        <strong>⚠️ MANDATORY ATTENDANCE:</strong> Your presence is mandatory as per Union Protocols. Failure to attend without prior written authorization may result in disciplinary action.
    </div>

    <div class="content">
        <p>You are requested to make necessary arrangements to ensure your attendance. In case of any genuine difficulty, you must seek prior written permission from the undersigned at least 24 hours before the event.</p>
        
        <p>This serves as an official directive and shall be treated with utmost importance.</p>
    </div>

    <div class="signature-block">
        <p><strong>For Teacher's Union,</strong></p>
        <div class="signature-line"></div>
        <div class="signature-name">{{ $signatoryName }}</div>
        <div class="signature-designation">{{ $signatoryDesignation }}</div>
        <div class="signature-designation">{{ ucfirst($event->event_scope ?? 'State') }} Level</div>
    </div>

    <div class="footer">
        This is an auto-generated document. For queries, contact your respective union office.
    </div>
</body>
</html>
