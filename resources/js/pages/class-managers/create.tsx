import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Class Managers',
        href: '/class-managers',
    },
    {
        title: 'Add Manager',
        href: '/class-managers/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_cm: '',
        program: '',
        bulan: '',
        kr1_1: '',
        kr1_2: '',
        kr1_3: '',
        kr1_4: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/class-managers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Class Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-4xl mx-auto">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-2xl">Tambah Kelolaan Class Manager</CardTitle>
                        <CardDescription>
                            Input data kualitatif dan kuantitatif untuk penentuan Awarding Class Manager.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_cm">Nama Class Manager</Label>
                                    <Input
                                        id="nama_cm"
                                        value={data.nama_cm}
                                        onChange={(e) => setData('nama_cm', e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        className={errors.nama_cm ? 'border-red-500' : ''}
                                    />
                                    {errors.nama_cm && <p className="text-xs text-red-500">{errors.nama_cm}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="program">Program</Label>
                                    <Select onValueChange={(value) => setData('program', value)}>
                                        <SelectTrigger className={errors.program ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Program" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Basic">Basic</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.program && <p className="text-xs text-red-500">{errors.program}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bulan">Bulan</Label>
                                    <Input
                                        id="bulan"
                                        value={data.bulan}
                                        onChange={(e) => setData('bulan', e.target.value)}
                                        placeholder="Contoh: April 2026"
                                        className={errors.bulan ? 'border-red-500' : ''}
                                    />
                                    {errors.bulan && <p className="text-xs text-red-500">{errors.bulan}</p>}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-4 text-primary">Kriteria Penilaian (0 - 100)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: 'kr1_1', label: 'KR 1.1 (Target Achievement)', desc: 'Pencapaian target bulan ini' },
                                        { id: 'kr1_2', label: 'KR 1.2 (Engagement Score)', desc: 'Interaksi dengan peserta' },
                                        { id: 'kr1_3', label: 'KR 1.3 (Task Completion)', desc: 'Kedisiplinan tugas admin' },
                                        { id: 'kr1_4', label: 'KR 1.4 (Student Feedback)', desc: 'Rating dari siswa' },
                                    ].map((kr) => (
                                        <div key={kr.id} className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor={kr.id}>{kr.label}</Label>
                                                <span className="text-[10px] text-muted-foreground uppercase">{kr.desc}</span>
                                            </div>
                                            <Input
                                                id={kr.id}
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                value={data[kr.id as keyof typeof data]}
                                                onChange={(e) => setData(kr.id as any, e.target.value)}
                                                placeholder="0.00"
                                                className={errors[kr.id as keyof typeof errors] ? 'border-red-500' : ''}
                                            />
                                            {errors[kr.id as keyof typeof errors] && (
                                                <p className="text-xs text-red-500">{errors[kr.id as keyof typeof errors]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/50 rounded-b-xl px-6 py-4">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
