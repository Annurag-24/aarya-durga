<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CoreValue;
use Illuminate\Http\Request;

class CoreValueController extends Controller
{
    public function index()
    {
        return response()->json(CoreValue::orderBy('sort_order')->get());
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

        $coreValue = CoreValue::create($validated);
        return response()->json($coreValue, 201);
    }

    public function show(CoreValue $coreValue)
    {
        return response()->json($coreValue);
    }

    public function update(Request $request, CoreValue $coreValue)
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

        $coreValue->update($validated);
        return response()->json($coreValue);
    }

    public function destroy(CoreValue $coreValue)
    {
        $coreValue->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:core_values,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            CoreValue::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Core values reordered successfully']);
    }
}
