import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileUp, Info, Table } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Class Managers',
        href: '/class-managers',
    },
    {
        title: 'Upload Data',
        href: '/class-managers/upload',
    },
];

export default function Upload() {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/class-managers/import', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Class Manager Data" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <FileUp className="h-6 w-6 text-primary" />
                            Upload Data Class Manager
                        </CardTitle>
                        <CardDescription>
                            Import data dalam jumlah banyak menggunakan file Excel (.xlsx) atau CSV.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="bg-muted/50 p-4 rounded-lg border border-dashed border-sidebar-border space-y-3">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div className="text-sm space-y-1">
                                        <p className="font-semibold">Petunjuk Format Berkas:</p>
                                        <p className="text-muted-foreground">
                                            Pastikan berkas Anda memiliki baris judul (header) dengan kolom sebagai berikut:
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {['nama_cm', 'program', 'bulan', 'kr1_1', 'kr1_2', 'kr1_3', 'kr1_4'].map((col) => (
                                                <code key={col} className="bg-background px-2 py-0.5 rounded border text-[10px] font-mono">
                                                    {col}
                                                </code>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="file" className="text-base">Pilih Berkas (.xlsx, .csv)</Label>
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="file"
                                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/30 border-sidebar-border transition-colors group"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Table className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold text-primary">Klik untuk memilih</span> atau seret berkas ke sini
                                            </p>
                                            <p className="text-xs text-muted-foreground">XLSX atau CSV (Maks. 5MB)</p>
                                            {data.file && (
                                                <p className="mt-4 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                    Berkas terpilih: {data.file.name}
                                                </p>
                                            )}
                                        </div>
                                        <input
                                            id="file"
                                            type="file"
                                            className="hidden"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                        />
                                    </label>
                                </div>
                                {errors.file && <p className="text-sm text-red-500 font-medium">{errors.file}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-muted/50 rounded-b-xl px-6 py-4">
                            <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing || !data.file} className="bg-primary hover:bg-primary/90 min-w-[120px]">
                                {processing ? 'Mengupload...' : 'Mulai Import'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
