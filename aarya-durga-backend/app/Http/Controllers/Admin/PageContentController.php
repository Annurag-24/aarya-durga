<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\Request;

class PageContentController extends Controller
{
    public function index()
    {
        return response()->json(PageContent::all());
    }

    public function show($pageKey)
    {
        $pageContent = PageContent::where('page_key', $pageKey)->with('image')->get();

        if ($pageContent->isEmpty()) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        return response()->json($pageContent);
    }

    public function showSection($pageKey, $sectionKey)
    {
        $pageContent = PageContent::where('page_key', $pageKey)
            ->where('section_key', $sectionKey)
            ->with('image')
            ->first();

        if (!$pageContent) {
            return response()->json([], 200);
        }

        // Transform to array format with language keys
        $result = [];
        if ($pageContent->content_en) {
            $result[] = ['language' => 'en', 'content' => $pageContent->content_en];
        }
        if ($pageContent->content_hi) {
            $result[] = ['language' => 'hi', 'content' => $pageContent->content_hi];
        }
        if ($pageContent->content_mr) {
            $result[] = ['language' => 'mr', 'content' => $pageContent->content_mr];
        }

        // Include image data if available
        if ($pageContent->image) {
            $result['image'] = $pageContent->image;
        }

        return response()->json($result);
    }

    public function update(Request $request, $pageKey, $sectionKey)
    {
        $validated = $request->validate([
            'language' => 'nullable|in:en,hi,mr',
            'content' => 'nullable|string',
            'content_en' => 'nullable|string',
            'content_hi' => 'nullable|string',
            'content_mr' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
        ]);

        $pageContent = PageContent::firstOrCreate(
            [
                'page_key' => $pageKey,
                'section_key' => $sectionKey,
            ]
        );

        $updateData = [];

        // Update language-specific content if language provided
        if (isset($validated['language']) && $validated['language']) {
            $languageColumn = 'content_' . $validated['language'];
            $updateData[$languageColumn] = $validated['content'];
        }

        foreach (['content_en', 'content_hi', 'content_mr'] as $column) {
            if (array_key_exists($column, $validated)) {
                $updateData[$column] = $validated[$column];
            }
        }

        // Update image if provided
        if (isset($validated['image_id'])) {
            $updateData['image_id'] = $validated['image_id'];
        }

        if (!empty($updateData)) {
            $pageContent->update($updateData);
        }

        return response()->json($pageContent->load('image'));
    }

    public function destroy($pageKey, $sectionKey)
    {
        PageContent::where('page_key', $pageKey)
            ->where('section_key', $sectionKey)
            ->delete();

        return response()->json(['message' => 'Page content deleted']);
    }
}
