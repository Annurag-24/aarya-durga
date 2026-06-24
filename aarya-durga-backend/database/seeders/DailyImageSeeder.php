<?php

namespace Database\Seeders;

use App\Models\DailyImage;
use App\Models\Media;
use Illuminate\Database\Seeder;

class DailyImageSeeder extends Seeder
{
    public function run(): void
    {
        // Get the current daily image record to reuse its data
        $current = DailyImage::first();
        $imageId = $current?->image_id;
        $captionEn = $current?->caption_en;
        $captionHi = $current?->caption_hi;
        $captionMr = $current?->caption_mr;

        // Wipe and re-seed all 15 day slots
        DailyImage::truncate();

        for ($day = 1; $day <= 15; $day++) {
            DailyImage::create([
                'day_number' => $day,
                'image_id'   => $imageId,
                'caption_en' => $captionEn,
                'caption_hi' => $captionHi,
                'caption_mr' => $captionMr,
            ]);
        }
    }
}
