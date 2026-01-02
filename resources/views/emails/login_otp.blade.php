<!DOCTYPE html>
<html>
<head>
    <title>Login OTP</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #138808; text-align: center;">Login Verification</h2>
        <p>Hello,</p>
        <p>You have requested to log in. Please use the following OTP to complete your login process:</p>
        <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #138808;">{{ $otp }}</span>
        </div>
        <p>This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
        <p>If you did not request this login, please contact support immediately.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">JKECC Portal</p>
    </div>
</body>
</html>
