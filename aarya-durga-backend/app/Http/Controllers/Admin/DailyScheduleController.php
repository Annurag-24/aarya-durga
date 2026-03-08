<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailySchedule;
use Illuminate\Http\Request;

class DailyScheduleController extends Controller
{
    public function index()
    {
        return response()->json(DailySchedule::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'time_label' => 'required|string',
            'event_en' => 'required|string',
            'event_hi' => 'required|string',
            'event_mr' => 'required|string',
            'sort_order' => 'integer',
        ]);

        $dailySchedule = DailySchedule::create($validated);
        return response()->json($dailySchedule, 201);
    }

    public function show(DailySchedule $dailySchedule)
    {
        return response()->json($dailySchedule);
    }

    public function update(Request $request, DailySchedule $dailySchedule)
    {
        $validated = $request->validate([
            'time_label' => 'string',
            'event_en' => 'string',
            'event_hi' => 'string',
            'event_mr' => 'string',
            'sort_order' => 'integer',
        ]);

        $dailySchedule->update($validated);
        return response()->json($dailySchedule);
    }

    public function destroy(DailySchedule $dailySchedule)
    {
        $dailySchedule->forceDelete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:daily_schedule,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            DailySchedule::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Daily schedules reordered successfully']);
    }
}
