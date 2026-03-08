<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PoojaService;
use Illuminate\Http\Request;

class PoojaServiceController extends Controller
{
    public function index()
    {
        return response()->json(PoojaService::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string',
            'title_hi' => 'required|string',
            'title_mr' => 'required|string',
            'schedule_en' => 'nullable|string',
            'schedule_hi' => 'nullable|string',
            'schedule_mr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $poojaService = PoojaService::create($validated);
        return response()->json($poojaService, 201);
    }

    public function show(PoojaService $poojaService)
    {
        return response()->json($poojaService);
    }

    public function update(Request $request, PoojaService $poojaService)
    {
        $validated = $request->validate([
            'title_en' => 'string',
            'title_hi' => 'string',
            'title_mr' => 'string',
            'schedule_en' => 'nullable|string',
            'schedule_hi' => 'nullable|string',
            'schedule_mr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $poojaService->update($validated);
        return response()->json($poojaService);
    }

    public function destroy(PoojaService $poojaService)
    {
        $poojaService->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:pooja_services,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            PoojaService::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Pooja services reordered successfully']);
    }
}
