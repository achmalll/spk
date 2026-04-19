<?php

namespace App\Services;

use App\Models\ClassManager;
use App\Models\TopsisResult;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class TopsisService
{
    /**
     * Criteria weights as per SRS: C1=0.2, C2=0.2, C3=0.4, C4=0.2
     *
     * @var array<int, float>
     */
    private array $weights = [0.2, 0.2, 0.4, 0.2];

    /**
     * All criteria are benefit type (higher is better).
     *
     * @var array<int, string>
     */
    private array $criteriaTypes = ['benefit', 'benefit', 'benefit', 'benefit'];

    /**
     * Run the full TOPSIS calculation and persist results.
     *
     * @return Collection<int, TopsisResult>
     */
    public function calculate(?string $bulan = null): Collection
    {
        $query = ClassManager::query();

        if ($bulan) {
            $query->where('bulan', $bulan);
        }

        $managers = $query->get();

        if ($managers->count() < 2) {
            return collect();
        }

        $matrix = $managers->map(fn ($cm) => [
            (float) $cm->kr1_1,
            (float) $cm->kr1_2,
            (float) $cm->kr1_3,
            (float) $cm->kr1_4,
        ])->toArray();

        $normalized = $this->normalize($matrix);
        $weighted = $this->applyWeights($normalized);
        [$idealPos, $idealNeg] = $this->getIdealSolutions($weighted);
        $distances = $this->calculateDistances($weighted, $idealPos, $idealNeg);
        $preferences = $this->calculatePreferences($distances);

        return $this->persistResults($managers, $preferences);
    }

    /**
     * Step 1: Normalize the decision matrix.
     *
     * @param  array<int, array<int, float>>  $matrix
     * @return array<int, array<int, float>>
     */
    private function normalize(array $matrix): array
    {
        $colCount = count($matrix[0]);
        $columnNorms = [];

        for ($j = 0; $j < $colCount; $j++) {
            $sumSquares = array_sum(array_map(fn ($row) => $row[$j] ** 2, $matrix));
            $columnNorms[$j] = sqrt($sumSquares);
        }

        return array_map(function ($row) use ($columnNorms, $colCount) {
            $result = [];
            for ($j = 0; $j < $colCount; $j++) {
                $result[$j] = $columnNorms[$j] > 0
                    ? $row[$j] / $columnNorms[$j]
                    : 0;
            }

            return $result;
        }, $matrix);
    }

    /**
     * Step 2: Apply weights to the normalized matrix.
     *
     * @param  array<int, array<int, float>>  $normalized
     * @return array<int, array<int, float>>
     */
    private function applyWeights(array $normalized): array
    {
        return array_map(function ($row) {
            return array_map(fn ($val, $weight) => $val * $weight, $row, $this->weights);
        }, $normalized);
    }

    /**
     * Step 3: Find positive and negative ideal solutions.
     *
     * @param  array<int, array<int, float>>  $weighted
     * @return array{0: array<int, float>, 1: array<int, float>}
     */
    private function getIdealSolutions(array $weighted): array
    {
        $colCount = count($weighted[0]);
        $idealPos = [];
        $idealNeg = [];

        for ($j = 0; $j < $colCount; $j++) {
            $column = array_column($weighted, $j);
            if ($this->criteriaTypes[$j] === 'benefit') {
                $idealPos[$j] = max($column);
                $idealNeg[$j] = min($column);
            } else {
                $idealPos[$j] = min($column);
                $idealNeg[$j] = max($column);
            }
        }

        return [$idealPos, $idealNeg];
    }

    /**
     * Step 4: Calculate distances to ideal solutions.
     *
     * @param  array<int, array<int, float>>  $weighted
     * @param  array<int, float>  $idealPos
     * @param  array<int, float>  $idealNeg
     * @return array<int, array{pos: float, neg: float}>
     */
    private function calculateDistances(array $weighted, array $idealPos, array $idealNeg): array
    {
        return array_map(function ($row) use ($idealPos, $idealNeg) {
            $dPos = sqrt(array_sum(array_map(fn ($v, $a) => ($v - $a) ** 2, $row, $idealPos)));
            $dNeg = sqrt(array_sum(array_map(fn ($v, $a) => ($v - $a) ** 2, $row, $idealNeg)));

            return ['pos' => $dPos, 'neg' => $dNeg];
        }, $weighted);
    }

    /**
     * Step 5: Calculate preference scores (relative closeness).
     *
     * @param  array<int, array{pos: float, neg: float}>  $distances
     * @return array<int, float>
     */
    private function calculatePreferences(array $distances): array
    {
        return array_map(function ($d) {
            $denominator = $d['pos'] + $d['neg'];

            return $denominator > 0 ? $d['neg'] / $denominator : 0;
        }, $distances);
    }

    /**
     * Persist results to the database.
     *
     * @param  Collection<int, ClassManager>  $managers
     * @param  array<int, float>  $preferences
     * @return Collection<int, TopsisResult>
     */
    private function persistResults(Collection $managers, array $preferences): Collection
    {
        $indexed = array_map(null, $managers->pluck('id')->toArray(), $preferences);
        usort($indexed, fn ($a, $b) => $b[1] <=> $a[1]);

        DB::transaction(function () use ($indexed, $managers) {
            $bulan = $managers->first()?->bulan ?? now()->format('F Y');
            TopsisResult::where('bulan', $bulan)->delete();

            foreach ($indexed as $rank => [$id, $preference]) {
                TopsisResult::create([
                    'class_manager_id' => $id,
                    'nilai_preferensi' => round($preference, 6),
                    'ranking' => $rank + 1,
                    'bulan' => $bulan,
                ]);
            }
        });

        return TopsisResult::with('classManager')->orderBy('ranking')->get();
    }
}
