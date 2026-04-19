import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, FileUp, Calculator, Trophy, Table as TableIcon, Info, Medal, Activity, Users, Star, CheckCircle2, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppearance } from '@/hooks/use-appearance';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Power Analytics', href: '/class-managers' }];

interface ClassManager {
    id: number;
    nama_cm: string;
    program: string;
    bulan: string;
    kr1_1: number;
    kr1_2: number;
    kr1_3: number;
    kr1_4: number;
}

interface TopsisResult {
    id: number;
    ranking: number;
    nilai_preferensi: number;
    class_manager: ClassManager;
}

interface Props {
    classManagers: ClassManager[];
    topsisResults: TopsisResult[];
    availableMonths: string[];
    selectedMonth: string;
    flash?: { success?: string; error?: string };
}

const steps = [
    "Synchronizing Manager Data...",
    "Normalizing Decision Matrix (R)...",
    "Applying Weighted Criteria (V)...",
    "Determining Ideal Solutions (A+ & A-)...",
    "Calculating Relative Distances...",
    "Computing Preference Scores...",
    "Finalizing Performance Rankings..."
];

export default function Index({ classManagers, topsisResults, availableMonths, selectedMonth, flash }: Props) {
    const { appearance, updateAppearance } = useAppearance();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calcStep, setCalcStep] = useState(0);

    const addForm = useForm({ nama_cm: '', program: '', batch: '', bulan: '', kr1_1: '', kr1_2: '', kr1_3: '', kr1_4: '' });
    const uploadForm = useForm({ file: null as File | null });

    const handleCalculate = () => {
        setIsCalculating(true);
        setCalcStep(0);
    };

    const handleMonthChange = (month: string) => {
        router.get(route('class-managers.index'), { bulan: month }, {
            preserveState: true,
            replace: true
        });
    };

    useEffect(() => {
        if (isCalculating && calcStep < steps.length) {
            const timer = setTimeout(() => {
                setCalcStep(prev => prev + 1);
            }, 600);
            return () => clearTimeout(timer);
        } else if (isCalculating && calcStep === steps.length) {
            router.post('/class-managers/calculate', { bulan: selectedMonth }, { 
                onFinish: () => {
                    setIsCalculating(false);
                    setCalcStep(0);
                } 
            });
        }
    }, [isCalculating, calcStep]);

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/class-managers', { onSuccess: () => { setShowAddModal(false); addForm.reset(); } });
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        uploadForm.post('/class-managers/import', { onSuccess: () => { setShowUploadModal(false); uploadForm.reset(); } });
    };

    const topThree = topsisResults.slice(0, 3);
    const others = topsisResults.slice(3);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Performance Analytics – TOPSIS Specialist" />
            
            <div className="flex flex-col gap-6 p-6 lg:p-8 w-full animate-in fade-in duration-700">
                
                {/* --- HEADER IDENTITY --- */}
                <div className="flex flex-col gap-2 border-b border-border/50 pb-8">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.3em] text-[10px] bg-primary/5 w-fit px-3 py-1 rounded-full border border-primary/10">
                        <Activity className="h-3 w-3" />
                        Expert Decision System
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent italic leading-tight">
                        Performance <span className="text-primary not-italic">Console</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                        Analisis perankingan objektif menggunakan algoritma TOPSIS khusus untuk periode <span className="text-foreground font-black underline decoration-primary decoration-2 underline-offset-4">{selectedMonth}</span>.
                    </p>
                </div>

                {/* --- CONSOLE CONTROL BAR --- */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/20 p-2 rounded-[2rem] border border-border/50 backdrop-blur-xl shadow-inner mb-2">
                    <div className="flex items-center gap-2 pl-4">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Periode Aktif:</span>
                        <Select value={selectedMonth} onValueChange={handleMonthChange}>
                            <SelectTrigger className="w-[200px] h-10 bg-background/80 border-border/50 text-sm font-black rounded-2xl focus:ring-primary/20 shadow-sm transition-all hover:bg-background">
                                <SelectValue placeholder="Pilih Periode..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border/50 shadow-2xl p-1">
                                {availableMonths.map((month) => (
                                    <SelectItem key={month} value={month} className="text-xs font-bold rounded-xl py-2 my-0.5">{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 pr-2">
                        <Button variant="ghost" size="icon" onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')} className="rounded-2xl h-10 w-10 hover:bg-background border border-transparent hover:border-border/50">
                            {appearance === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                        <div className="w-px h-6 bg-border/50 mx-2" />
                        
                        <div className="flex items-center gap-2 bg-background/50 p-1 rounded-2xl border border-border/50">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddModal(true)} className="rounded-xl h-8 hover:bg-muted text-[11px] font-bold px-4">
                                <PlusCircle className="mr-2 h-3.5 w-3.5" /> Entry Manual
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(true)} className="rounded-xl h-8 hover:bg-muted text-[11px] font-bold px-4">
                                <FileUp className="mr-2 h-3.5 w-3.5" /> Batch Import
                            </Button>
                        </div>
                        
                        <Button onClick={handleCalculate} disabled={isCalculating || classManagers.length < 2}
                            className="rounded-2xl h-10 px-6 bg-primary hover:bg-primary shadow-xl shadow-primary/20 transition-all active:scale-95 text-primary-foreground font-black text-xs uppercase tracking-widest ml-2">
                            <Calculator className="mr-2 h-4 w-4" />
                            {isCalculating ? 'Processing...' : 'Run Analytics'}
                        </Button>
                    </div>
                </div>

                {/* Calculation Monitor Overlay */}
                {isCalculating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in transition-all">
                        <div className="max-w-md w-full p-8 rounded-3xl border border-border bg-card shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                    <Calculator className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">TOPSIS Engine Active</h3>
                                    <p className="text-sm text-muted-foreground italic">Menjalankan 7 tahapan algoritma perankingan...</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {steps.map((step, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center gap-3 text-sm transition-all duration-300",
                                        i < calcStep ? "text-primary/70 scale-100" : i === calcStep ? "text-foreground font-bold scale-105" : "text-muted-foreground/30 scale-95"
                                    )}>
                                        {i < calcStep ? (
                                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                        ) : (
                                            <div className={cn("h-4 w-4 rounded-full border-2 shrink-0 transition-colors", i === calcStep ? "border-primary animate-pulse" : "border-muted/30")} />
                                        )}
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Unified Analytics Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left & Middle: Main Analytics Console */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        
                        {/* Podium Section - 3 equal columns, compact */}
                        {topThree.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {topThree.map((res, i) => (
                                    <Card key={res.id} className={cn(
                                        "relative overflow-hidden group transition-all hover:-translate-y-0.5 shadow-lg",
                                        i === 0 ? "bg-gradient-to-br from-yellow-500/15 via-yellow-500/5 to-transparent border border-yellow-500/30" : 
                                        i === 1 ? "bg-gradient-to-br from-slate-400/15 via-slate-400/5 to-transparent border border-slate-400/30" :
                                        "bg-gradient-to-br from-amber-600/15 via-amber-600/5 to-transparent border border-amber-600/30"
                                    )}>
                                        <CardContent className="p-4">
                                            {/* Background rank number */}
                                            <div className="absolute top-2 right-3 text-5xl font-black opacity-[0.07] group-hover:opacity-[0.12] transition-opacity leading-none select-none">
                                                #{res.ranking}
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                {/* Trophy icon + rank */}
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                                                        i === 0 ? "bg-yellow-500/20 text-yellow-600" : 
                                                        i === 1 ? "bg-slate-400/20 text-slate-600" : "bg-amber-600/20 text-amber-700"
                                                    )}>
                                                        <Trophy className="h-4 w-4" />
                                                    </div>
                                                    <span className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest opacity-60",
                                                    )}>Rank #{res.ranking}</span>
                                                </div>
                                                {/* Name */}
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{res.class_manager.nama_cm}</h4>
                                                    <span className="text-[9px] font-black italic text-muted-foreground/70 mt-0.5 block">{res.class_manager.batch}</span>
                                                </div>
                                                {/* Program */}
                                                <div className="border-t border-border/30 pt-2">
                                                    <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-50 mb-0.5">PROGRAM</p>
                                                    <p className="text-xs font-black italic text-foreground/90 group-hover:text-primary transition-colors leading-tight">{res.class_manager.program}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Data Console Table */}
                        <Card className="border-border/50 shadow-none overflow-hidden bg-muted/10 backdrop-blur-sm">
                            <div className="px-5 py-3 border-b border-border/50 flex items-center justify-between bg-background/40">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-background shadow-sm border border-border/50">
                                        <Users className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-sm">Dataset Manager</h3>
                                    <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{classManagers.length} entri</span>
                                </div>
                                <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Skor 0–100
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-background/20">
                                        <TableRow className="hover:bg-transparent border-border/50">
                                            <TableHead className="min-w-[160px] text-xs">Nama CM</TableHead>
                                            <TableHead className="min-w-[140px] text-xs">Program / Batch</TableHead>
                                            <TableHead className="text-center min-w-[100px] text-xs">Periode</TableHead>
                                            <TableHead className="text-right min-w-[70px] text-xs">C1</TableHead>
                                            <TableHead className="text-right min-w-[70px] text-xs">C2</TableHead>
                                            <TableHead className="text-right min-w-[70px] text-xs">C3</TableHead>
                                            <TableHead className="text-right min-w-[70px] text-xs">C4</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classManagers.length > 0 ? classManagers.map((cm) => (
                                            <TableRow key={cm.id} className="group border-border/30 hover:bg-background/50 transition-colors">
                                                <TableCell className="py-2.5">
                                                    <div className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">{cm.nama_cm}</div>
                                                </TableCell>
                                                <TableCell className="py-2.5">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold leading-tight">{cm.program}</span>
                                                        <span className="text-[10px] text-primary font-bold italic">{cm.batch}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center py-2.5">
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold whitespace-nowrap">{cm.bulan}</span>
                                                </TableCell>
                                                {[cm.kr1_1, cm.kr1_2, cm.kr1_3, cm.kr1_4].map((val, idx) => (
                                                    <TableCell key={idx} className="text-right py-2.5">
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="font-mono text-xs font-bold">{Number(val).toFixed(1)}</span>
                                                            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                                                                <div className={cn(
                                                                    "h-full rounded-full transition-all duration-500",
                                                                    val > 80 ? "bg-emerald-500" : val > 60 ? "bg-blue-500" : "bg-orange-500"
                                                                )} style={{ width: `${val}%` }} />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2 opacity-40">
                                                        <TableIcon className="h-7 w-7" />
                                                        <p className="text-xs">Belum ada data di periode ini.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Ranking Feed */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <Card className="border-border/50 sticky top-6 bg-card shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary/10 to-transparent px-5 py-4 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 shrink-0" />
                                        <h3 className="font-black italic text-base tracking-tight uppercase leading-tight">
                                            Ranking {selectedMonth}
                                        </h3>
                                    </div>
                                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[9px] font-black italic shrink-0">V-SCORE</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">Peringkat berdasarkan skor preferensi TOPSIS.</p>
                            </div>

                            {/* List */}
                            <div className="divide-y divide-border/20 max-h-[70vh] overflow-y-auto">
                                {topsisResults.length > 0 ? topsisResults.map((res) => (
                                    <div key={res.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-muted/20 transition-colors">
                                        {/* Rank Badge */}
                                        <div className="relative shrink-0">
                                            <div className={cn(
                                                "h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs border-2 transition-all",
                                                res.ranking === 1 ? "bg-yellow-500/15 border-yellow-500/50 text-yellow-600" : 
                                                res.ranking === 2 ? "bg-slate-400/15 border-slate-400/40 text-slate-500" :
                                                res.ranking === 3 ? "bg-amber-600/15 border-amber-600/40 text-amber-700" : 
                                                "bg-muted/50 border-border/40 text-muted-foreground"
                                            )}>
                                                {res.ranking}
                                            </div>
                                            {res.ranking <= 3 && <Medal className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 fill-current text-yellow-500" />}
                                        </div>

                                        {/* Info - takes remaining space */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-xs leading-tight group-hover:text-primary transition-colors truncate">
                                                {res.class_manager.nama_cm}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                                <span className="text-[8px] px-1 py-px bg-muted/80 rounded font-black uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                                                    {res.class_manager.program}
                                                </span>
                                                <span className="text-[8px] text-primary font-black italic whitespace-nowrap">{res.class_manager.batch}</span>
                                            </div>
                                        </div>

                                        {/* V-Score - fixed width, never wraps */}
                                        <div className="shrink-0 text-right pl-2 border-l border-border/30">
                                            <div className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest">V-Score</div>
                                            <div className="font-mono font-black text-sm text-primary tabular-nums">
                                                {Number(res.nilai_preferensi).toFixed(4)}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-16 text-center space-y-3">
                                        <div className="h-12 w-12 mx-auto bg-muted/50 rounded-2xl flex items-center justify-center border border-dashed border-border/50">
                                            {classManagers.length < 2 
                                                ? <Users className="h-5 w-5 text-muted-foreground opacity-30" /> 
                                                : <Calculator className="h-5 w-5 text-primary animate-bounce" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">
                                                {classManagers.length < 2 ? 'Data Kurang' : 'Siap Dihitung'}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-1 max-w-[140px] mx-auto leading-relaxed">
                                                {classManagers.length < 2 
                                                    ? 'Minimal 2 manajer diperlukan.' 
                                                    : 'Klik Run Analytics untuk kalkulasi.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                </div>
            </div>

            {/* Modals are unchanged in logic but slightly styled */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="max-w-lg rounded-3xl border-border/50 shadow-2xl overflow-hidden p-0">
                    <DialogHeader className="p-8 pb-0">
                        <DialogTitle className="text-2xl font-black italic tracking-tight uppercase">Entry Manager Data</DialogTitle>
                        <DialogDescription>Tambahkan dataset performa untuk manager baru.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="p-8 pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="nama_cm" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nama Lengkap</Label>
                                <Input id="nama_cm" className="rounded-xl border-border/50 focus:ring-primary/20" value={addForm.data.nama_cm} onChange={e => addForm.setData('nama_cm', e.target.value)} />
                                {addForm.errors.nama_cm && <p className="text-xs text-red-500 font-medium">{addForm.errors.nama_cm}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Batch</Label>
                                <Input className="rounded-xl border-border/50" value={addForm.data.batch} onChange={e => addForm.setData('batch', e.target.value)} placeholder="cth: Batch 12" />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Program Spesifikasi</Label>
                                <Select onValueChange={v => addForm.setData('program', v)}>
                                    <SelectTrigger className="rounded-xl border-border/50"><SelectValue placeholder="Pilih program" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Project Management">Project Management</SelectItem>
                                        <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                        <SelectItem value="Backend Development">Backend Development</SelectItem>
                                        <SelectItem value="Fullstack Intensive">Fullstack Intensive</SelectItem>
                                        <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="bulan" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Periode Penilaian (Bulan/Tahun)</Label>
                                <Input id="bulan" className="rounded-xl border-border/50" value={addForm.data.bulan} onChange={e => addForm.setData('bulan', e.target.value)} placeholder="cth: Juni 2026" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5 py-4 px-5 bg-muted/30 rounded-2xl border border-border/50">
                            {[
                                { id: 'kr1_1', label: 'C1: Achievement' },
                                { id: 'kr1_2', label: 'C2: Engagement' },
                                { id: 'kr1_3', label: 'C3: Completion' },
                                { id: 'kr1_4', label: 'C4: Feedback' },
                            ].map(({ id, label }) => (
                                <div key={id} className="space-y-1.5">
                                    <Label htmlFor={id} className="text-[10px] font-black uppercase text-secondary-foreground/60 tracking-widest">{label}</Label>
                                    <Input id={id} type="number" step="0.01" className="h-9 rounded-lg border-border/50 bg-background/50"
                                        value={addForm.data[id as keyof typeof addForm.data]}
                                        onChange={e => addForm.setData(id as any, e.target.value)} />
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button type="submit" className="rounded-xl px-8 bg-primary hover:bg-primary font-bold" disabled={addForm.processing}>
                                Save Manager Data
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogContent className="max-w-md rounded-3xl border-border/50 shadow-2xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic tracking-tight uppercase">Batch Upload</DialogTitle>
                        <DialogDescription>
                            Upload datasheet `.xlsx` atau `.csv` dengan header standar sistem.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUploadSubmit} className="space-y-6 pt-4">
                        <label htmlFor="upload-file"
                            className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-3xl cursor-pointer bg-muted/10 hover:bg-muted/20 border-border/50 transition-all group">
                            <div className="text-center group-hover:scale-110 transition-transform">
                                <FileUp className="mx-auto h-12 w-12 text-primary opacity-50 mb-3" />
                                <p className="text-sm font-bold italic">
                                    {uploadForm.data.file ? uploadForm.data.file.name : 'Click to select spreadsheet'}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Accepts CSV, XLSX</p>
                            </div>
                            <input id="upload-file" type="file" className="hidden" accept=".xlsx,.xls,.csv"
                                onChange={e => uploadForm.setData('file', e.target.files?.[0] ?? null)} />
                        </label>
                        {uploadForm.errors.file && <p className="text-sm text-red-500 font-medium italic">{uploadForm.errors.file}</p>}
                        <DialogFooter>
                            <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                            <Button type="submit" className="rounded-xl px-8 bg-primary hover:bg-primary font-bold" disabled={uploadForm.processing || !uploadForm.data.file}>
                                Start Import
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
