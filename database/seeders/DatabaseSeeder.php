<?php

namespace Database\Seeders;

use App\Models\ClassManager;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin Specialist',
            'email' => 'admin@spk.com',
        ]);

        $programs = ['Project Management', 'Frontend Development', 'Backend Development', 'Fullstack Intensive', 'Data Analytics'];
        $batches = ['Batch 01', 'Batch 12', 'Batch 13'];
        $months = ['January 2026', 'February 2026', 'September 2026'];

        foreach ($months as $month) {
            foreach ($programs as $program) {
                ClassManager::create([
                    'nama_cm' => fake()->name(),
                    'program' => $program,
                    'batch' => $batches[array_rand($batches)],
                    'bulan' => $month,
                    'kr1_1' => rand(60, 95),
                    'kr1_2' => rand(60, 95),
                    'kr1_3' => rand(60, 95),
                    'kr1_4' => rand(60, 95),
                ]);
            }
        }
    }
}
