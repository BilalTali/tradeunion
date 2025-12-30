<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Send OTP via SMS
     * 
     * Configure your SMS gateway in config/services.php
     */
    public function sendOtp(string $mobileNumber, string $otp): bool
    {
        // Get SMS gateway configuration
        $gateway = config('services.sms.gateway', 'log'); // default to log for testing

        try {
            switch ($gateway) {
                case 'msg91':
                    return $this->sendViaMSG91($mobileNumber, $otp);
                
                case 'twilio':
                    return $this->sendViaTwilio($mobileNumber, $otp);
                
                case 'fast2sms':
                    return $this->sendViaFast2SMS($mobileNumber, $otp);
                
                case 'log':
                default:
                    // For testing: just log the OTP
                    Log::info("OTP for {$mobileNumber}: {$otp}");
                    return true;
            }
        } catch (\Exception $e) {
            Log::error("SMS sending failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send via MSG91 (India)
     */
    private function sendViaMSG91(string $mobileNumber, string $otp): bool
    {
        $response = Http::withHeaders([
            'authkey' => config('services.sms.msg91.auth_key'),
        ])->post('https://api.msg91.com/api/v5/otp', [
            'template_id' => config('services.sms.msg91.template_id'),
            'mobile' => $mobileNumber,
            'otp' => $otp,
        ]);

        return $response->successful();
    }

    /**
     * Send via Twilio (Global)
     */
    private function sendViaTwilio(string $mobileNumber, string $otp): bool
    {
        $accountSid = config('services.sms.twilio.account_sid');
        $authToken = config('services.sms.twilio.auth_token');
        $fromNumber = config('services.sms.twilio.from_number');

        $client = new \Twilio\Rest\Client($accountSid, $authToken);
        
        $message = $client->messages->create(
            $mobileNumber,
            [
                'from' => $fromNumber,
                'body' => "Your voting OTP is: {$otp}. Valid for 5 minutes."
            ]
        );

        return $message->sid !== null;
    }

    /**
     * Send via Fast2SMS (India)
     */
    private function sendViaFast2SMS(string $mobileNumber, string $otp): bool
    {
        $response = Http::withHeaders([
            'authorization' => config('services.sms.fast2sms.api_key'),
        ])->post('https://www.fast2sms.com/dev/bulkV2', [
            'route' => 'otp',
            'variables_values' => $otp,
            'numbers' => $mobileNumber,
        ]);

        return $response->successful();
    }
}
