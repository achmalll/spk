<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MLService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.ml.url', 'http://127.0.0.1:8002');
    }

    /**
     * Get predictions for multiple class managers.
     *
     * @param array $items Array of [nama, achievement, engagement, completion, feedback]
     * @return array|null
     */
    public function predictBatch(array $items): ?array
    {
        try {
            $response = Http::timeout(10)->post("{$this->baseUrl}/prediksi-batch", $items);

            if ($response->successful()) {
                return $response->json('hasil');
            }

            Log::error('ML API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('ML API Exception: ' . $e->getMessage());
            return null;
        }
    }
}
