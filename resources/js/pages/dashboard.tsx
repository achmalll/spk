import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Trophy, Upload, Activity, Users, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Manager {
    id: number;
    nama: string;
    batch: string;
}

interface Result {
    id: number;
    manager_id: number;
    saw_score: string;
    ml_score: string;
    hybrid_score: string;
    final_score: string;
    rank_system: number;
    rank_pakar: number;
    month: string;
    year: number;
    manager: Manager;
}

interface Criteria {
    id: number;
    name: string;
    weight: string;
}

interface Props {
    results: Result[];
    criterias: Criteria[];
    filters: {
        month: string;
        year: number;
    };
    availablePeriods: {
        month: string;
        year: number;
    }[];
    stats: {
        correlation: number;
        accuracyTop3: number;
        totalCM: number;
    };
}

export default function Dashboard({ results, criterias, filters, availablePeriods, stats }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });

    const { post: postReset, processing: processingReset } = useForm();

    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('import'), {
            forceFormData: true,
        });
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to delete ALL evaluation data? This cannot be undone.')) {
            postReset(route('reset'));
        }
    };

    const handleFilterChange = (month: string, year: number) => {
        // Simple navigation via Inertia for filtering
        window.location.href = route('dashboard', { month, year });
    };

    const top3 = results.slice(0, 3);

    const getCorrelationColor = (val: number) => {
        if (val >= 0.7) return 'text-emerald-500';
        if (val >= 0.4) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getValidityStatus = (val: number) => {
        if (val >= 0.7) return 'Sangat Baik';
        if (val >= 0.4) return 'Cukup';
        return 'Lemah';
    };

    return (
        <AppLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Evaluation Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-indigo-500"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase">Spearman Correlation (rₛ)</p>
                                    <h3 className={cn("text-3xl font-bold mt-1", getCorrelationColor(stats.correlation))}>
                                        {stats.correlation}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1">Status: {getValidityStatus(stats.correlation)}</p>
                                </div>
                                <Activity className="w-10 h-10 text-indigo-200" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-emerald-500"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase">Top-3 Accuracy</p>
                                    <h3 className="text-3xl font-bold text-emerald-600 mt-1">{stats.accuracyTop3}%</h3>
                                    <p className="text-xs text-gray-400 mt-1">Consistency with Expert</p>
                                </div>
                                <CheckCircle className="w-10 h-10 text-emerald-200" />
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-amber-500"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase">Total Evaluated</p>
                                    <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats.totalCM} CMs</h3>
                                    <p className="text-xs text-gray-400 mt-1">Active Class Managers</p>
                                </div>
                                <Users className="w-10 h-10 text-amber-200" />
                            </div>
                        </motion.div>
                    </div>
                    {/* Filters & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Periode:</span>
                            <select 
                                value={`${filters.month}-${filters.year}`}
                                onChange={(e) => {
                                    const [m, y] = e.target.value.split('-');
                                    handleFilterChange(m, parseInt(y));
                                }}
                                className="border-none focus:ring-0 font-bold text-indigo-600 cursor-pointer bg-transparent"
                            >
                                <option value={`${filters.month}-${filters.year}`}>{filters.month} {filters.year} (Current)</option>
                                {availablePeriods.map((p, i) => (
                                    p.month !== filters.month || p.year !== filters.year ? (
                                        <option key={i} value={`${p.month}-${p.year}`}>{p.month} {p.year}</option>
                                    ) : null
                                ))}
                            </select>
                        </div>

                        <button 
                            onClick={handleReset}
                            disabled={processingReset}
                            className="text-xs font-bold text-rose-500 hover:text-rose-700 uppercase tracking-widest border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                            {processingReset ? 'Resetting...' : '⚠️ Reset All Data'}
                        </button>
                    </div>

                    {/* Import Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-indigo-500" />
                            Import Performa Bulanan (Otomatis: {filters.month} {filters.year})
                        </h3>
                        <form onSubmit={submitImport} className="flex flex-col md:flex-row items-end gap-4">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CSV File (rank_pakar, nama, batch, KR 1.1, KR 1.2, KR 1.3, KR 1.4)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="file" 
                                        onChange={e => setData('file', e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <a 
                                        href={route('template')} 
                                        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
                                    >
                                        <FileSpreadsheet className="w-4 h-4" />
                                        Download Template
                                    </a>
                                </div>
                                {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                            </div>
                            <button 
                                type="submit" 
                                disabled={processing || !data.file}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Process Evaluation'}
                            </button>
                        </form>
                    </div>

                    {/* Podium Visualization */}
                    {top3.length > 0 && (
                        <div className="flex flex-col items-center justify-end h-80 pt-10">
                            <div className="flex items-end gap-2 md:gap-8 w-full max-w-4xl px-4">
                                {/* 2nd Place */}
                                <div className="flex-1 flex flex-col items-center group">
                                    <div className="mb-2 text-center">
                                        <p className="font-bold text-gray-600 truncate w-24 md:w-full">{top3[1]?.manager.nama}</p>
                                        <p className="text-xs text-gray-400">Hybrid: {parseFloat(top3[1]?.hybrid_score).toFixed(4)}</p>
                                    </div>
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '140px' }}
                                        className="w-full bg-slate-300 rounded-t-xl shadow-lg flex flex-col items-center pt-4 relative group-hover:bg-slate-400 transition-colors"
                                    >
                                        <span className="text-3xl font-black text-slate-500">2</span>
                                        <Trophy className="w-8 h-8 text-slate-100 mt-2" />
                                    </motion.div>
                                </div>

                                {/* 1st Place */}
                                <div className="flex-1 flex flex-col items-center group">
                                    <div className="mb-2 text-center">
                                        <p className="font-black text-gray-900 text-lg truncate w-32 md:w-full">{top3[0]?.manager.nama}</p>
                                        <p className="text-xs text-indigo-500 font-bold">Hybrid: {parseFloat(top3[0]?.hybrid_score).toFixed(4)}</p>
                                    </div>
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '200px' }}
                                        className="w-full bg-amber-400 rounded-t-xl shadow-xl flex flex-col items-center pt-4 relative border-t-4 border-amber-200 group-hover:bg-amber-500 transition-colors"
                                    >
                                        <span className="text-5xl font-black text-amber-700">1</span>
                                        <Trophy className="w-12 h-12 text-amber-100 mt-2" />
                                        <div className="absolute -top-4 w-12 h-12 bg-amber-200/50 rounded-full blur-xl animate-pulse" />
                                    </motion.div>
                                </div>

                                {/* 3rd Place */}
                                <div className="flex-1 flex flex-col items-center group">
                                    <div className="mb-2 text-center">
                                        <p className="font-bold text-gray-600 truncate w-24 md:w-full">{top3[2]?.manager.nama}</p>
                                        <p className="text-xs text-gray-400">Hybrid: {parseFloat(top3[2]?.hybrid_score).toFixed(4)}</p>
                                    </div>
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: '100px' }}
                                        className="w-full bg-amber-700/60 rounded-t-xl shadow-lg flex flex-col items-center pt-4 relative group-hover:bg-amber-700/80 transition-colors"
                                    >
                                        <span className="text-3xl font-black text-amber-900">3</span>
                                        <Trophy className="w-6 h-6 text-amber-100 mt-2" />
                                    </motion.div>
                                </div>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full mt-[-2px] shadow-sm max-w-4xl" />
                        </div>
                    )}

                    {/* Table Results */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Ranking Comparison</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">Rank</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">Pakar</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">Class Manager</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">Nilai SAW</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">Nilai ML</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest bg-indigo-50">Nilai Hybrid</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">Diff</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {results.map((result) => {
                                            const diff = Math.abs(result.rank_system - result.rank_pakar);
                                            return (
                                                <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={cn(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                            result.rank_system <= 3 ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"
                                                        )}>
                                                            #{result.rank_system}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{result.rank_pakar}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{result.manager.nama}</div>
                                                        <div className="text-xs text-gray-500">{result.manager.batch}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                                        {parseFloat(result.saw_score).toFixed(4)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-mono text-emerald-600">
                                                                {parseFloat(result.ml_score).toFixed(4)}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                                                                ML Probability
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap bg-indigo-50/50">
                                                        <span className="text-sm font-black text-indigo-700 font-mono">
                                                            {parseFloat(result.hybrid_score).toFixed(4)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {diff === 0 ? (
                                                            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" /> Accurate
                                                            </span>
                                                        ) : (
                                                            <span className="text-amber-500 text-xs font-bold">
                                                                ±{diff} positions
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {results.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                                    No data available. Please import a CSV file to begin evaluation.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Info Kriteria Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-indigo-400">
                            <h4 className="font-bold text-indigo-600 text-xs uppercase mb-2">KR 1.1 (C1)</h4>
                            <p className="text-sm font-black text-gray-800 mb-1">Service CM Quality</p>
                            <p className="text-xs text-gray-500 leading-relaxed">Respons, komunikasi, dan cara CM menangani masalah student.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-emerald-400">
                            <h4 className="font-bold text-emerald-600 text-xs uppercase mb-2">KR 1.2 (C2)</h4>
                            <p className="text-sm font-black text-gray-800 mb-1">Student Experience</p>
                            <p className="text-xs text-gray-500 leading-relaxed">Kenyamanan belajar, interaksi di kelas, dan kelancaran teknis.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-amber-400">
                            <h4 className="font-bold text-amber-600 text-xs uppercase mb-2">KR 1.3 (C3)</h4>
                            <p className="text-sm font-black text-gray-800 mb-1">CSAT (Satisfaction)</p>
                            <p className="text-xs text-gray-500 leading-relaxed">Hasil akhir kepuasan student terhadap seluruh proses bootcamp.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-rose-400">
                            <h4 className="font-bold text-rose-600 text-xs uppercase mb-2">KR 1.4 (C4)</h4>
                            <p className="text-sm font-black text-gray-800 mb-1">Student Engagement</p>
                            <p className="text-xs text-gray-500 leading-relaxed">Keaktifan student dalam hadir, mengerjakan tugas, dan test.</p>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
