<?php

namespace App\Imports;

use App\Models\ClassManager;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ClassManagerImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @return Model|null
     */
    public function model(array $row)
    {
        return new ClassManager([
            'nama_cm' => $row['nama_cm'],
            'program' => $row['program'],
            'batch' => $row['batch'] ?? 'Batch 01', // Default if missing
            'bulan' => $row['bulan'],
            'kr1_1' => $row['kr1_1'],
            'kr1_2' => $row['kr1_2'],
            'kr1_3' => $row['kr1_3'],
            'kr1_4' => $row['kr1_4'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nama_cm' => ['required', 'string'],
            'program' => ['required', 'string'],
            'batch' => ['nullable', 'string'],
            'bulan' => ['required', 'string'],
            'kr1_1' => ['required', 'numeric', 'min:0', 'max:100'],
            'kr1_2' => ['required', 'numeric', 'min:0', 'max:100'],
            'kr1_3' => ['required', 'numeric', 'min:0', 'max:100'],
            'kr1_4' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
