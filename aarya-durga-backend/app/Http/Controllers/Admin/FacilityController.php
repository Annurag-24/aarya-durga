<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FacilityController extends Controller
{
    public function index()
    {
        return response()->json(
            Facility::with(['image', 'media.media'])->orderBy('sort_order')->get()
        );
    }

    public function publicIndex()
    {
        return response()->json(
            Facility::with(['image', 'media.media'])
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function publicShowBySlug(string $slug)
    {
        $facility = Facility::with(['image', 'media.media'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($facility);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $mediaIds = $validated['media_ids'] ?? [];
        unset($validated['media_ids']);

        $validated['slug'] = $this->makeUniqueSlug($validated['title_en'] ?? null);
        $validated['title_hi'] = $validated['title_hi'] ?? ($validated['title_en'] ?? '');
        $validated['title_mr'] = $validated['title_mr'] ?? ($validated['title_en'] ?? '');

        $facility = Facility::create($validated);
        $this->syncMedia($facility, $mediaIds);

        return response()->json($facility->load(['image', 'media.media']), 201);
    }

    public function show(Facility $facility)
    {
        return response()->json($facility->load(['image', 'media.media']));
    }

    public function update(Request $request, Facility $facility)
    {
        $validated = $request->validate($this->rules($facility));
        $mediaIds = $validated['media_ids'] ?? null;
        unset($validated['media_ids']);

        if (array_key_exists('title_en', $validated)) {
            $validated['slug'] = $this->makeUniqueSlug(
                $validated['title_en'] ?? $facility->title_en,
                $facility->id
            );
        }

        if (array_key_exists('title_en', $validated) && !array_key_exists('title_hi', $validated)) {
            $validated['title_hi'] = $validated['title_en'];
        }
        if (array_key_exists('title_en', $validated) && !array_key_exists('title_mr', $validated)) {
            $validated['title_mr'] = $validated['title_en'];
        }

        $facility->update($validated);

        if ($mediaIds !== null) {
            $this->syncMedia($facility, $mediaIds);
        }

        return response()->json($facility->load(['image', 'media.media']));
    }

    private function syncMedia(Facility $facility, array $mediaIds): void
    {
        $facility->media()->delete();

        foreach ($mediaIds as $index => $mediaId) {
            $facility->media()->create([
                'media_id' => $mediaId,
                'sort_order' => $index,
            ]);
        }
    }

    public function destroy(Facility $facility)
    {
        $facility->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:facilities,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            Facility::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Facilities reordered successfully']);
    }

    private function rules(?Facility $facility = null): array
    {
        return [
            'title_en' => [$facility ? 'sometimes' : 'required', 'string'],
            'title_hi' => 'nullable|string',
            'title_mr' => 'nullable|string',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'has_details_page' => 'boolean',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'integer|exists:media,id',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    private function makeUniqueSlug(?string $titleEn, ?int $ignoreId = null): ?string
    {
        $base = Str::slug($titleEn ?: '');
        if (!$base) {
            return null;
        }

        $candidate = $base;
        $suffix = 2;

        while (
            Facility::when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = "{$base}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }
}
