<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(Event::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string',
            'title_hi' => 'required|string',
            'title_mr' => 'required|string',
            'date_label_en' => 'nullable|string',
            'date_label_hi' => 'nullable|string',
            'date_label_mr' => 'nullable|string',
            'event_date' => 'nullable|date',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'category' => 'required|in:Festival,Yatra,Pooja',
            'image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title_en' => 'string',
            'title_hi' => 'string',
            'title_mr' => 'string',
            'date_label_en' => 'nullable|string',
            'date_label_hi' => 'nullable|string',
            'date_label_mr' => 'nullable|string',
            'event_date' => 'nullable|date',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'category' => 'in:Festival,Yatra,Pooja',
            'image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:events,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            Event::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Events reordered successfully']);
    }
}
