<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(Gallery::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image_id' => 'required|exists:media,id',
            'alt_en' => 'required|string',
            'alt_hi' => 'required|string',
            'alt_mr' => 'required|string',
            'caption_en' => 'nullable|string',
            'caption_hi' => 'nullable|string',
            'caption_mr' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $gallery = Gallery::create($validated);
        return response()->json($gallery, 201);
    }

    public function show(Gallery $gallery)
    {
        return response()->json($gallery);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'image_id' => 'exists:media,id',
            'alt_en' => 'string',
            'alt_hi' => 'string',
            'alt_mr' => 'string',
            'caption_en' => 'nullable|string',
            'caption_hi' => 'nullable|string',
            'caption_mr' => 'nullable|string',
            'sort_order' => 'integer',
        ]);

        $gallery->update($validated);
        return response()->json($gallery);
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:galleries,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            Gallery::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Galleries reordered successfully']);
    }
}
