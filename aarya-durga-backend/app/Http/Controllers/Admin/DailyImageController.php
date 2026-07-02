<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyImage;
use Illuminate\Http\Request;

class DailyImageController extends Controller
{
    private const DAYS = 15;

    private function pruneExpired(): void
    {
        DailyImage::whereNotNull('image_date')
            ->where('image_date', '<', date('Y-m-d'))
            ->delete();
    }

    public function index(Request $request)
    {
        $this->pruneExpired();

        $query = DailyImage::with('image')->whereNotNull('image_date');

        if ($from = $request->query('from')) {
            $query->where('image_date', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->where('image_date', '<=', $to);
        }

        return response()->json($query->orderBy('image_date')->get());
    }

    public function upsertByDate(Request $request, string $date)
    {
        $this->pruneExpired();

        $validated = $request->validate([
            'image_id'   => 'nullable|exists:media,id',
            'caption_en' => 'nullable|string|max:500',
            'caption_hi' => 'nullable|string|max:500',
            'caption_mr' => 'nullable|string|max:500',
        ]);

        $parsed = \DateTime::createFromFormat('Y-m-d', $date);
        if (!$parsed || $parsed->format('Y-m-d') !== $date) {
            return response()->json(['error' => 'Invalid date format. Use YYYY-MM-DD.'], 422);
        }

        $today = date('Y-m-d');
        $windowEnd = date('Y-m-d', strtotime($today . ' +' . (self::DAYS - 1) . ' days'));
        if ($date < $today || $date > $windowEnd) {
            return response()->json([
                'error' => "Date must be within {$today} and {$windowEnd}.",
            ], 422);
        }

        $record = DailyImage::firstOrCreate(['image_date' => $date]);
        $record->update($validated);

        return response()->json($record->load('image'));
    }

    public function destroyByDate(string $date)
    {
        DailyImage::where('image_date', $date)->delete();
        return response()->json(['deleted' => true]);
    }

    public function publicIndex()
    {
        $this->pruneExpired();

        return response()->json(
            DailyImage::with('image')
                ->whereNotNull('image_date')
                ->whereNotNull('image_id')
                ->orderBy('image_date')
                ->get()
        );
    }

    public function publicShow()
    {
        $today = date('Y-m-d');
        $record = DailyImage::with('image')
            ->where('image_date', $today)
            ->whereNotNull('image_id')
            ->first();

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
