<?php

namespace Database\Seeders;

use App\Models\DailyImage;
use Illuminate\Database\Seeder;

class DailyImageSeeder extends Seeder
{
    public function run(): void
    {
        DailyImage::firstOrCreate(['id' => 1], ['image_id' => null]);
    }
}
