<?php

namespace Database\Factories;

use App\Models\ClassManager;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClassManager>
 */
class ClassManagerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_cm' => $this->faker->name(),
            'program' => $this->faker->randomElement(['Basic', 'Intermediate', 'Advanced']),
            'batch' => 'Batch '.$this->faker->numberBetween(1, 10),
            'bulan' => $this->faker->monthName().' 2026',
            'kr1_1' => $this->faker->randomFloat(2, 60, 100),
            'kr1_2' => $this->faker->randomFloat(2, 60, 100),
            'kr1_3' => $this->faker->randomFloat(2, 60, 100),
            'kr1_4' => $this->faker->randomFloat(2, 60, 100),
        ];
    }
}
