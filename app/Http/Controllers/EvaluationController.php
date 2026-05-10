<?php

namespace App\Http\Controllers;

use App\Models\ClassManager;
use App\Models\Criteria;
use App\Models\EvaluationResult;
use App\Models\PerformanceScore;
use App\Services\SAWService;
use App\Services\SpearmanService;
use App\Services\MLService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EvaluationController extends Controller
{
    public function __construct(
        protected SAWService $sawService,
        protected SpearmanService $spearmanService,
        protected MLService $mlService
    ) {}

    public function index(Request $request)
    {
        $selectedMonth = $request->get('month', now()->format('F'));
        $selectedYear = $request->get('year', now()->format('Y'));

        $results = EvaluationResult::with('manager')
            ->where('month', $selectedMonth)
            ->where('year', $selectedYear)
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

        // Available months and years in database for filter
        $availablePeriods = EvaluationResult::select('month', 'year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'results' => $results,
            'criterias' => $criterias,
            'filters' => [
                'month' => $selectedMonth,
                'year' => (int)$selectedYear,
            ],
            'availablePeriods' => $availablePeriods,
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
        // Simplified mapping for the 4 main criterias (Updated to KR version)
        $criteriaMap = [
            'kr11' => Criteria::where('name', 'LIKE', '%KR 1.1%')->first()?->id,
            'kr12' => Criteria::where('name', 'LIKE', '%KR 1.2%')->first()?->id,
            'kr13' => Criteria::where('name', 'LIKE', '%KR 1.3%')->first()?->id,
            'kr14' => Criteria::where('name', 'LIKE', '%KR 1.4%')->first()?->id,
        ];

        $currentMonth = now()->format('F');
        $currentYear = (int)now()->format('Y');

        DB::beginTransaction();
        try {
            // We no longer delete ALL data, only for the CURRENT month if it exists
            EvaluationResult::where('month', $currentMonth)->where('year', $currentYear)->delete();
            // Note: In a real production system, we might want to handle manager and score deletion more carefully 
            // if they are shared across months. For now, we'll keep it simple.

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
                    'kr11' => (float) ($row[3] ?? 0),
                    'kr12' => (float) ($row[4] ?? 0),
                    'kr13' => (float) ($row[5] ?? 0),
                    'kr14' => (float) ($row[6] ?? 0),
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
                
                // Store original scores for ML API
                $rawScores[$manager->id] = array_merge(['nama' => $nama], $scores);
            }
            fclose($handle);

            // Run SAW
            $allCriterias = Criteria::all();
            $weights = $allCriterias->pluck('weight', 'id')->toArray();

            $normalized = $this->sawService->normalize($matrix, $allCriterias);
            $sawScores = $this->sawService->calculate($normalized, $weights);

            // Get ML Predictions
            $mlPredictions = $this->mlService->predictBatch(array_values($rawScores));
            
            // Map ML predictions back to manager IDs
            $mlMap = [];
            if ($mlPredictions) {
                foreach ($mlPredictions as $index => $pred) {
                    $managerId = array_keys($rawScores)[$index];
                    $mlMap[$managerId] = $pred['proba'];
                }
            }

            // Combine Hybrid Score (70% SAW + 30% ML)
            $hybridScores = [];
            foreach ($sawScores as $managerId => $sawScore) {
                $mlScore = $mlMap[$managerId] ?? 0;
                $hybridScore = (0.7 * $sawScore) + (0.3 * $mlScore);
                $hybridScores[$managerId] = [
                    'saw' => $sawScore,
                    'ml' => $mlScore,
                    'hybrid' => $hybridScore
                ];
            }

            // Re-sort by Hybrid Score
            uasort($hybridScores, fn($a, $b) => $b['hybrid'] <=> $a['hybrid']);

            $rank = 1;
            foreach ($hybridScores as $managerId => $scores) {
                EvaluationResult::create([
                    'manager_id' => $managerId,
                    'saw_score' => $scores['saw'],
                    'ml_score' => $scores['ml'],
                    'hybrid_score' => $scores['hybrid'],
                    'final_score' => $scores['hybrid'], // Still keep final_score for legacy compatibility
                    'rank_system' => $rank++,
                    'rank_pakar' => $pakarRanks[$managerId],
                    'month' => $currentMonth,
                    'year' => $currentYear,
                ]);
            }

            DB::commit();

            return back()->with('success', "Data for $currentMonth $currentYear imported and processed successfully.");

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Error processing CSV: '.$e->getMessage());
        }
    }

    public function template()
    {
        $headers = [
            'rank_pakar', 'nama', 'batch', 'kr_1.1_service_quality', 'kr_1.2_student_experience', 'kr_1.3_csat', 'kr_1.4_engagement_crr',
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

    public function reset()
    {
        DB::beginTransaction();
        try {
            EvaluationResult::query()->delete();
            PerformanceScore::query()->delete();
            ClassManager::query()->delete();
            DB::commit();
            return back()->with('success', 'All evaluation data has been cleared.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to reset data: ' . $e->getMessage());
        }
    }
}
