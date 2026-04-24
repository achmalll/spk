<?php

namespace App\Services;

class SpearmanService
{
    /**
     * Calculate Spearman Rank Correlation Coefficient (rs)
     * rs = 1 - (6 * sum(d^2)) / (n * (n^2 - 1))
     */
    public function calculateCorrelation(array $systemRanks, array $pakarRanks): float
    {
        $n = count($systemRanks);
        if ($n <= 1) {
            return 1.0;
        }

        $sumD2 = 0;
        foreach ($systemRanks as $managerId => $rank) {
            $d = $rank - ($pakarRanks[$managerId] ?? 0);
            $sumD2 += pow($d, 2);
        }

        return 1 - (6 * $sumD2) / ($n * (pow($n, 2) - 1));
    }

    /**
     * Calculate accuracy for Top-N selection
     */
    public function getAccuracyTopN(array $systemRanks, array $pakarRanks, int $n = 3): float
    {
        $count = count($systemRanks);
        if ($count === 0) {
            return 0.0;
        }

        $n = min($n, $count);

        $topSystem = array_keys(array_filter($systemRanks, fn ($rank) => $rank <= $n));
        $topPakar = array_keys(array_filter($pakarRanks, fn ($rank) => $rank <= $n));

        $matches = count(array_intersect($topSystem, $topPakar));

        return $matches / $n;
    }
}
