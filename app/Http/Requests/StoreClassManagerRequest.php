<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreClassManagerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_cm' => ['required', 'string', 'max:255'],
            'program' => ['required', 'string', 'max:255'],
            'bulan' => ['required', 'string', 'max:50'],
            'kr1_1' => ['required', 'numeric', 'min:0', 'max:100'],
            'kr1_2' => ['required', 'numeric', 'min:0', 'max:100'],
            'kr1_3' => ['required', 'numeric', 'min:0', 'max:100'],
            'kr1_4' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
