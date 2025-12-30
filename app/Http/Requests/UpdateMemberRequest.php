<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMemberRequest extends FormRequest
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
            'tehsil_id' => 'sometimes|required|exists:tehsils,id',
            'name' => 'sometimes|required|string|max:255',
            'parentage' => 'sometimes|required|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'dob' => 'nullable|date|before:today',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => ['nullable', 'regex:/^[0-9]{10}$/'],
            'school_name' => 'sometimes|required|string|max:255',
            // 'designation' => 'sometimes|required|string|max:255', // Removed
            // 'subject' => 'nullable|string|max:255', // Removed
            // 'service_join_year' => 'nullable|integer|min:1950|max:' . now()->year, // Removed
            'union_join_date' => 'sometimes|required|date|before_or_equal:today',
            'star_grade' => 'nullable|integer|between:0,5',
            'member_status' => 'sometimes|required|in:Member,Tehsil Member,District Member,State Member',
            'status' => 'nullable|in:pending,active,suspended,resigned,deceased',
        ];
    }
}

