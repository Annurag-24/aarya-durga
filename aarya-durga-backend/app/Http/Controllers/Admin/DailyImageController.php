<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyImage;
use Illuminate\Http\Request;

class DailyImageController extends Controller
{
    private const DAYS = 15;

    public function index()
    {
        for ($d = 1; $d <= self::DAYS; $d++) {
            DailyImage::firstOrCreate(['day_number' => $d]);
        }

        return response()->json(
            DailyImage::with('image')->orderBy('day_number')->get()
        );
    }

    public function show(int $day)
    {
        $record = DailyImage::with('image')->firstOrCreate(['day_number' => $day]);
        return response()->json($record);
    }

    public function update(Request $request, int $day)
    {
        $validated = $request->validate([
            'image_id'   => 'nullable|exists:media,id',
            'caption_en' => 'nullable|string|max:500',
            'caption_hi' => 'nullable|string|max:500',
            'caption_mr' => 'nullable|string|max:500',
        ]);

        $record = DailyImage::firstOrCreate(['day_number' => $day]);
        $record->update($validated);

        return response()->json($record->load('image'));
    }

    public function publicIndex()
    {
        return response()->json(
            DailyImage::with('image')
                ->whereNotNull('image_id')
                ->orderBy('day_number')
                ->get()
        );
    }

    public function publicShow()
    {
        $start = DailyImage::min('created_at');
        if ($start) {
            $daysElapsed = (int) floor((time() - strtotime($start)) / 86400);
            $day = ($daysElapsed % self::DAYS) + 1;
        } else {
            $day = 1;
        }

        $record = DailyImage::with('image')->where('day_number', $day)->first();

        if (!$record || !$record->image) {
            $record = DailyImage::with('image')->whereNotNull('image_id')->orderBy('day_number')->first();
        }

        if (!$record || !$record->image) {
            return response()->json(['image' => null]);
        }

        return response()->json([
            'image'      => $record->image,
            'caption_en' => $record->caption_en,
            'caption_hi' => $record->caption_hi,
            'caption_mr' => $record->caption_mr,
        ]);
    }
}
