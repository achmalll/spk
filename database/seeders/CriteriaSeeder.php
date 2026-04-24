<?php

namespace Database\Seeders;

use App\Models\Criteria;
use Illuminate\Database\Seeder;

class CriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $criterias = [
            ['name' => 'C1 - Achievement', 'weight' => 0.25, 'type' => 'benefit'],
            ['name' => 'C2 - Engagement', 'weight' => 0.25, 'type' => 'benefit'],
            ['name' => 'C3 - Completion', 'weight' => 0.25, 'type' => 'benefit'],
            ['name' => 'C4 - Feedback', 'weight' => 0.25, 'type' => 'benefit'],
        ];

        foreach ($criterias as $criteria) {
            Criteria::create($criteria);
        }
    }
}
