<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // TODO: Add proper authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tehsil_id' => 'required|exists:tehsils,id',
            'member_status' => 'required|in:Member,Tehsil Member,District Member,State Member',
            'name' => 'required|string|max:255',
            'parentage' => 'required|string|max:255',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Photo is required for new registration
            'dob' => 'nullable|date|before:today',
            'contact_email' => 'required|email:rfc,dns|max:255|unique:users,email',
            // Indian mobile: must start with 6-9, exactly 10 digits, no country code
            'contact_phone' => ['required', 'regex:/^[6-9]\d{9}$/', 'digits:10'],
            'school_name' => 'required|string|max:255',
            'union_join_date' => 'required|date|before_or_equal:today',
        ];
    }
    
    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'contact_phone.regex' => 'Phone number must be a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9).',
            'contact_phone.digits' => 'Phone number must be exactly 10 digits.',
            'contact_email.email' => 'Please provide a valid email address.',
        ];
    }
}
