<?php

namespace App\Http\Controllers;

use App\Models\ClassManager;
use App\Models\Criteria;
use App\Models\EvaluationResult;
use App\Models\PerformanceScore;
use App\Services\SAWService;
use App\Services\SpearmanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EvaluationController extends Controller
{
    public function __construct(
        protected SAWService $sawService,
        protected SpearmanService $spearmanService
    ) {}

    public function index()
    {
        $results = EvaluationResult::with('manager')
            ->orderBy('rank_system')
            ->get();

        $criterias = Criteria::all();

        $correlation = 0;
        $accuracyTop3 = 0;

        if ($results->count() > 0) {
            $systemRanks = $results->pluck('rank_system', 'manager_id')->toArray();
            $pakarRanks = $results->pluck('rank_pakar', 'manager_id')->toArray();

            $correlation = $this->spearmanService->calculateCorrelation($systemRanks, $pakarRanks);
            $accuracyTop3 = $this->spearmanService->getAccuracyTopN($systemRanks, $pakarRanks, 3);
        }

        return Inertia::render('Dashboard', [
            'results' => $results,
            'criterias' => $criterias,
            'stats' => [
                'correlation' => round($correlation, 4),
                'accuracyTop3' => round($accuracyTop3 * 100, 2),
                'totalCM' => ClassManager::count(),
            ],
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        $header = fgetcsv($handle); // rank_pakar, nama, batch, achievement, engagement, completion, feedback

        // Map criteria names to IDs
        $criterias = Criteria::all()->pluck('id', 'name')->toArray();
        // Simplified mapping for the 4 main criterias
        $criteriaMap = [
            'achievement' => Criteria::where('name', 'LIKE', '%Achievement%')->first()?->id,
            'engagement' => Criteria::where('name', 'LIKE', '%Engagement%')->first()?->id,
            'completion' => Criteria::where('name', 'LIKE', '%Completion%')->first()?->id,
            'feedback' => Criteria::where('name', 'LIKE', '%Feedback%')->first()?->id,
        ];

        DB::beginTransaction();
        try {
            // Clear existing data for fresh evaluation
            EvaluationResult::query()->delete();
            PerformanceScore::query()->delete();
            ClassManager::query()->delete();

            $matrix = [];
            $pakarRanks = [];
            $managers = [];

            ini_set('auto_detect_line_endings', true);
            while (($row = fgetcsv($handle)) !== false) {
                if (empty($row) || ! isset($row[1])) {
                    continue;
                }
                // Assuming header: rank_pakar, nama, batch, achievement, engagement, completion, feedback
                $rankPakar = (int) $row[0];
                $nama = $row[1];
                $batch = $row[2] ?? 'Default';
                $scores = [
                    'achievement' => (float) ($row[3] ?? 0),
                    'engagement' => (float) ($row[4] ?? 0),
                    'completion' => (float) ($row[5] ?? 0),
                    'feedback' => (float) ($row[6] ?? 0),
                ];

                $manager = ClassManager::create([
                    'nama' => $nama,
                    'batch' => $batch,
                ]);

                $managers[$manager->id] = $manager;
                $pakarRanks[$manager->id] = $rankPakar;

                foreach ($scores as $key => $value) {
                    $criteriaId = $criteriaMap[$key];
                    if ($criteriaId) {
                        PerformanceScore::create([
                            'manager_id' => $manager->id,
                            'criteria_id' => $criteriaId,
                            'value' => $value,
                        ]);
                        $matrix[$manager->id][$criteriaId] = $value;
                    }
                }
            }
            fclose($handle);

            // Run SAW
            $allCriterias = Criteria::all();
            $weights = $allCriterias->pluck('weight', 'id')->toArray();

            $normalized = $this->sawService->normalize($matrix, $allCriterias);
            $finalScores = $this->sawService->calculate($normalized, $weights);

            $rank = 1;
            foreach ($finalScores as $managerId => $score) {
                EvaluationResult::create([
                    'manager_id' => $managerId,
                    'final_score' => $score,
                    'rank_system' => $rank++,
                    'rank_pakar' => $pakarRanks[$managerId],
                ]);
            }

            DB::commit();

            return back()->with('success', 'Data imported and processed successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Error processing CSV: '.$e->getMessage());
        }
    }

    public function template()
    {
        $headers = [
            'rank_pakar', 'nama', 'batch', 'achievement', 'engagement', 'completion', 'feedback',
        ];

        $callback = function () use ($headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            // Sample data
            fputcsv($file, [1, 'Ahmad Fauzi', 'Batch 10', 95, 90, 100, 95]);
            fputcsv($file, [2, 'Siti Aminah', 'Batch 10', 90, 85, 95, 90]);
            fputcsv($file, [3, 'Budi Santoso', 'Batch 11', 85, 95, 90, 85]);
            fputcsv($file, [4, 'Rina Wijaya', 'Batch 11', 80, 80, 85, 80]);
            fputcsv($file, [5, 'Dedi Kurniawan', 'Batch 10', 75, 75, 80, 75]);

            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=cm_performance_template.csv',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ]);
    }
}
