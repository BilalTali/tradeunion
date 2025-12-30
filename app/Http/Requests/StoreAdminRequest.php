<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdminRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return in_array($user->role, ['super_admin', 'district_admin', 'district_president']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            // Strict email validation with RFC compliance and DNS verification
            'email' => 'required|email:rfc,dns|unique:users,email',
            'phone' => ['nullable', 'regex:/^[0-9]{10}$/'],
            'password' => 'required|min:8|confirmed',
            'admin_role' => 'required|in:district_admin,district_president,tehsil_admin,tehsil_president',
            'entity_id' => 'required|integer',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'admin_role.required' => 'Please select an admin role.',
            'entity_id.required' => 'Please select a district or tehsil.',
        ];
    }
}
