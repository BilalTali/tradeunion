<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Voter Slip - {{ $voterSlip->slip_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .slip {
            border: 2px solid #dc2626;
            border-radius: 10px;
            padding: 20px;
            max-width: 400px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #fbbf24;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        .header h1 {
            color: #dc2626;
            margin: 0;
            font-size: 18px;
        }
        .header h2 {
            color: #374151;
            margin: 10px 0 0;
            font-size: 14px;
        }
        .content {
            padding: 15px 0;
        }
        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .label {
            color: #6b7280;
            font-size: 12px;
        }
        .value {
            color: #111827;
            font-weight: bold;
            font-size: 14px;
        }
        .slip-number {
            background: linear-gradient(135deg, #dc2626, #f59e0b);
            color: white;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
            margin: 15px 0;
            font-family: monospace;
            font-size: 16px;
            letter-spacing: 2px;
        }
        .verification {
            background: #fef3c7;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }
        .verification .label {
            font-size: 10px;
        }
        .verification .code {
            font-family: monospace;
            font-size: 18px;
            color: #dc2626;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px dashed #d1d5db;
            font-size: 10px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="slip">
        <div class="header">
            <h1>{{ $officeProfile->organization_name ?? 'SSA TEACHERS ASSOCIATION' }}</h1>
            <h2>{{ $election->title }}</h2>
        </div>
        
        <div class="content">
            <div class="row">
                <span class="label">Voter Name</span>
                <span class="value">{{ $member->name }}</span>
            </div>
            <div class="row">
                <span class="label">Membership ID</span>
                <span class="value">{{ $member->membership_id }}</span>
            </div>
            <div class="row">
                <span class="label">Tehsil</span>
                <span class="value">{{ $member->tehsil?->name }}</span>
            </div>
            <div class="row">
                <span class="label">District</span>
                <span class="value">{{ $member->tehsil?->district?->name }}</span>
            </div>
        </div>

        <div class="slip-number">
            {{ $voterSlip->slip_number }}
        </div>

        <div class="verification">
            <div class="label">VERIFICATION CODE</div>
            <div class="code">{{ $voterSlip->verification_code }}</div>
        </div>

        <div class="footer">
            <p>Present this slip at the voting booth</p>
            <p>Election Type: {{ ucwords(str_replace('_', ' ', $election->election_type)) }}</p>
        </div>
    </div>
</body>
</html>
