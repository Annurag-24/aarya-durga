<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HistoryTimeline;
use Illuminate\Http\Request;

class HistoryTimelineController extends Controller
{
    public function index()
    {
        return response()->json(HistoryTimeline::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'era_label_en' => 'required|string',
            'era_label_hi' => 'required|string',
            'era_label_mr' => 'required|string',
            'title_en' => 'required|string',
            'title_hi' => 'required|string',
            'title_mr' => 'required|string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $historyTimeline = HistoryTimeline::create($validated);
        return response()->json($historyTimeline, 201);
    }

    public function show(HistoryTimeline $historyTimeline)
    {
        return response()->json($historyTimeline);
    }

    public function update(Request $request, HistoryTimeline $historyTimeline)
    {
        $validated = $request->validate([
            'era_label_en' => 'string',
            'era_label_hi' => 'string',
            'era_label_mr' => 'string',
            'title_en' => 'string',
            'title_hi' => 'string',
            'title_mr' => 'string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $historyTimeline->update($validated);
        return response()->json($historyTimeline);
    }

    public function destroy(HistoryTimeline $historyTimeline)
    {
        $historyTimeline->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:history_timelines,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            HistoryTimeline::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'History timelines reordered successfully']);
    }
}
