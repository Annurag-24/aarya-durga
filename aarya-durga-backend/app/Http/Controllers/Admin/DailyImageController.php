<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyImage;
use Illuminate\Http\Request;

class DailyImageController extends Controller
{
    public function show()
    {
        return response()->json(DailyImage::with('image')->firstOrCreate(['id' => 1]));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'image_id'   => 'nullable|exists:media,id',
            'caption_en' => 'nullable|string|max:500',
            'caption_hi' => 'nullable|string|max:500',
            'caption_mr' => 'nullable|string|max:500',
        ]);

        $record = DailyImage::firstOrCreate(['id' => 1]);
        $record->update($validated);

        return response()->json($record->load('image'));
    }

    public function publicShow()
    {
        $record = DailyImage::with('image')->firstOrCreate(['id' => 1]);

        if (!$record->image) {
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
