<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DonationCategory;
use Illuminate\Http\Request;

class DonationCategoryController extends Controller
{
    public function index()
    {
        return response()->json(DonationCategory::orderBy('sort_order')->get());
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
            'suggested_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $donationCategory = DonationCategory::create($validated);
        return response()->json($donationCategory, 201);
    }

    public function show(DonationCategory $donationCategory)
    {
        return response()->json($donationCategory);
    }

    public function update(Request $request, DonationCategory $donationCategory)
    {
        $validated = $request->validate([
            'title_en' => 'string',
            'title_hi' => 'string',
            'title_mr' => 'string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'suggested_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $donationCategory->update($validated);
        return response()->json($donationCategory);
    }

    public function destroy(DonationCategory $donationCategory)
    {
        $donationCategory->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:donation_categories,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            DonationCategory::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Donation categories reordered successfully']);
    }
}
