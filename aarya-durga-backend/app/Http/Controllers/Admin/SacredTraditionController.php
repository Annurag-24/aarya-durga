<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SacredTradition;
use Illuminate\Http\Request;

class SacredTraditionController extends Controller
{
    public function index()
    {
        return response()->json(SacredTradition::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string',
            'title_hi' => 'required|string',
            'title_mr' => 'required|string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $sacredTradition = SacredTradition::create($validated);
        return response()->json($sacredTradition, 201);
    }

    public function show(SacredTradition $sacredTradition)
    {
        return response()->json($sacredTradition);
    }

    public function update(Request $request, SacredTradition $sacredTradition)
    {
        $validated = $request->validate([
            'title_en' => 'string',
            'title_hi' => 'string',
            'title_mr' => 'string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $sacredTradition->update($validated);
        return response()->json($sacredTradition);
    }

    public function destroy(SacredTradition $sacredTradition)
    {
        $sacredTradition->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:sacred_traditions,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            SacredTradition::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Sacred traditions reordered successfully']);
    }
}
