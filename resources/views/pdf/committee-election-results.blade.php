<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Committee Election Results</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 40px;
            color: #1f2937;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1e40af;
            padding-bottom: 20px;
        }
        .title {
            font-size: 28px;
            font-weight: 700;
            color: #1e40af;
            margin: 0 0 10px 0;
        }
        .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin: 5px 0;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0 30px 0;
            background: #f9fafb;
        }
        .info-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-table td:first-child {
            font-weight: 600;
            width: 40%;
            color: #374151;
        }
        .position-header {
            background: #dbeafe;
            padding: 15px;
            font-weight: 700;
            font-size: 16px;
            margin-top: 30px;
            border-left: 4px solid #1e40af;
            color: #1e3a8a;
        }
        .candidate {
            display: table;
            width: 100%;
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
        }
        .candidate-info {
            display: table-cell;
            vertical-align: middle;
        }
        .candidate-votes {
            display: table-cell;
            text-align: right;
            vertical-align: middle;
            width: 150px;
        }
        .winner {
            background: #d1fae5;
            border-left: 4px solid #10b981;
        }
        .candidate-name {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
        }
        .candidate-id {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
        }
        .vote-count {
            font-size: 24px;
            font-weight: 700;
            color: #1e40af;
        }
        .vote-percentage {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
        }
        .trophy {
            font-size: 20px;
            margin-right: 8px;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(30, 64, 175, 0.05);
            z-index: -1;
            font-weight: 900;
        }
    </style>
</head>
<body>
    <div class="watermark">OFFICIAL</div>
    
    <div class="header">
        <h1 class="title">{{ $election->title }}</h1>
        <p class="subtitle"><strong>{{ $election->committee->name }}</strong></p>
        <p class="subtitle">{{ ucfirst($election->committee->level) }} Level Committee</p>
        <p class="subtitle">Results Generated: {{ now()->format('d M Y, h:i A') }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td>Election Type:</td>
            <td>{{ ucfirst(str_replace('_', ' ', $election->election_type)) }}</td>
        </tr>
        <tr>
            <td>Total Eligible Voters:</td>
            <td>{{ number_format($election->eligible_voters_count) }}</td>
        </tr>
        <tr>
            <td>Total Votes Cast:</td>
            <td>{{ number_format($election->total_votes_cast) }}</td>
        </tr>
        <tr>
            <td>Voter Turnout:</td>
            <td>
                @if($election->eligible_voters_count > 0)
                    {{ number_format(($election->total_votes_cast / $election->eligible_voters_count) * 100, 2) }}%
                @else
                    N/A
                @endif
            </td>
        </tr>
        <tr>
            <td>Voting Period:</td>
            <td>{{ \Carbon\Carbon::parse($election->voting_start)->format('d M Y') }} - {{ \Carbon\Carbon::parse($election->voting_end)->format('d M Y') }}</td>
        </tr>
    </table>

    <h2 style="font-size: 20px; color: #111827; margin: 30px 0 20px 0;">Election Results by Position</h2>

    @foreach($resultsByPosition as $position => $results)
        <div class="position-header">
            {{ ucfirst(str_replace('_', ' ', $position)) }}
        </div>
        
        @foreach($results as $index => $result)
            <div class="candidate {{ $index === 0 ? 'winner' : '' }}">
                <div class="candidate-info">
                    @if($index === 0)
                        <span class="trophy">🏆</span>
                    @endif
                    <div class="candidate-name">{{ $result->member->name }}</div>
                    <div class="candidate-id">Member ID: {{ $result->member->membership_id }}</div>
                </div>
                <div class="candidate-votes">
                    <div class="vote-count">{{ number_format($result->vote_count) }}</div>
                    <div class="vote-percentage">
                        @if($election->total_votes_cast > 0)
                            ({{ number_format(($result->vote_count / $election->total_votes_cast) * 100, 1) }}%)
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    @endforeach

    <div class="footer">
        <p><strong>This is an official document generated by the Election Management System</strong></p>
        <p>{{ config('app.name') }} | {{ now()->format('Y') }}</p>
        <p style="margin-top: 10px; font-size: 10px;">
            Document ID: CE-{{ $election->id }}-{{ now()->timestamp }}
        </p>
    </div>
</body>
</html>
