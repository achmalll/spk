<?php

namespace App\Services;

class SAWService
{
    public function normalize(array $matrix, $criterias): array
    {
        $normalized = [];
        $maxValues = [];

        // Find max values for each criteria
        foreach ($criterias as $criteria) {
            $values = array_column($matrix, $criteria->id);
            $maxValues[$criteria->id] = ! empty($values) ? max($values) : 0;
        }

        foreach ($matrix as $managerId => $scores) {
            foreach ($scores as $criteriaId => $value) {
                // Since all are benefit: R = x / max
                $normalized[$managerId][$criteriaId] = $maxValues[$criteriaId] > 0 ? $value / $maxValues[$criteriaId] : 0;
            }
        }

        return $normalized;
    }

    public function calculate(array $normalizedMatrix, array $weights): array
    {
        $results = [];

        foreach ($normalizedMatrix as $managerId => $scores) {
            $total = 0;
            foreach ($scores as $criteriaId => $value) {
                $total += $value * ($weights[$criteriaId] ?? 0);
            }
            $results[$managerId] = $total;
        }

        arsort($results); // Sort descending by score

        return $results;
    }
}
