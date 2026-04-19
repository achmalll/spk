<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClassManagerRequest;
use App\Imports\ClassManagerImport;
use App\Models\ClassManager;
use App\Models\TopsisResult;
use App\Services\TopsisService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class ClassManagerController extends Controller
{
    /**
     * Display a listing of the class managers.
     */
    public function index(Request $request): Response
    {
        $selectedMonth = $request->query('bulan');

        // Get available months for the filter dropdown (Latest first)
        $availableMonths = ClassManager::select('bulan')
            ->distinct()
            ->orderBy('id', 'desc')
            ->pluck('bulan');

        // If no month is selected, default to the latest available
        if (! $selectedMonth && $availableMonths->isNotEmpty()) {
            $selectedMonth = $availableMonths->first();
        }

        return Inertia::render('class-managers/index', [
            'classManagers' => ClassManager::where('bulan', $selectedMonth)->latest()->get(),
            'topsisResults' => TopsisResult::with('classManager')
                ->where('bulan', $selectedMonth)
                ->orderBy('ranking')
                ->get(),
            'availableMonths' => $availableMonths,
            'selectedMonth' => $selectedMonth,
        ]);
    }

    /**
     * Show the form for creating a new class manager.
     */
    public function create(): Response
    {
        return Inertia::render('class-managers/create');
    }

    /**
     * Store a newly created class manager in storage.
     */
    public function store(StoreClassManagerRequest $request)
    {
        ClassManager::create($request->validated());

        return redirect()->route('class-managers.index')
            ->with('success', 'Data Class Manager berhasil ditambahkan.');
    }

    /**
     * Show the upload form.
     */
    public function upload(): Response
    {
        return Inertia::render('class-managers/upload');
    }

    /**
     * Handle the Excel/CSV import.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv,txt'],
        ]);

        Excel::import(new ClassManagerImport, $request->file('file'));

        return redirect()->route('class-managers.index')
            ->with('success', 'Data Class Manager berhasil diimport.');
    }

    /**
     * Run TOPSIS calculation and redirect back with results.
     */
    public function calculate(Request $request, TopsisService $topsisService)
    {
        $bulan = $request->input('bulan');

        if (! $bulan) {
            return redirect()->back()->with('error', 'Pilih periode bulan terlebih dahulu.');
        }

        if (ClassManager::where('bulan', $bulan)->count() < 2) {
            return redirect()->back()->with('error', "Minimal 2 data Class Manager diperlukan untuk periode $bulan.");
        }

        $topsisService->calculate($bulan);

        return redirect()->route('class-managers.index', ['bulan' => $bulan])
            ->with('success', "Perhitungan TOPSIS untuk periode $bulan berhasil diselesaikan!");
    }
}
