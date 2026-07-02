<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(
            Event::with(['coverImage', 'galleryImages.media'])
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function publicIndex()
    {
        return response()->json(
            Event::with(['coverImage', 'galleryImages.media'])
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $galleryImageIds = $validated['gallery_image_ids'] ?? [];
        unset($validated['gallery_image_ids']);

        $validated['slug'] = $this->makeUniqueSlug(
            null,
            $validated['title_en'] ?? null
        );
        $validated['title_hi'] = $validated['title_hi'] ?? ($validated['title_en'] ?? '');
        $validated['title_mr'] = $validated['title_mr'] ?? ($validated['title_en'] ?? '');
        $validated['summary_hi'] = $validated['summary_hi'] ?? ($validated['summary_en'] ?? null);
        $validated['description_hi'] = $validated['description_hi'] ?? ($validated['description_en'] ?? null);
        $validated['details_hi'] = $validated['details_hi'] ?? ($validated['details_en'] ?? null);
        $validated['location_hi'] = $validated['location_hi'] ?? ($validated['location_en'] ?? null);
        $validated['time_hi'] = $validated['time_hi'] ?? ($validated['time_en'] ?? null);

        $event = Event::create($validated);
        $this->syncGalleryImages($event, $galleryImageIds);

        return response()->json($event->load(['coverImage', 'galleryImages.media']), 201);
    }

    public function show(Event $event)
    {
        return response()->json($event->load(['coverImage', 'galleryImages.media']));
    }

    public function publicShowBySlug(string $slug)
    {
        $event = Event::with(['coverImage', 'galleryImages.media'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate($this->rules($event));
        $galleryImageIds = $validated['gallery_image_ids'] ?? null;
        unset($validated['gallery_image_ids']);

        if (array_key_exists('title_en', $validated)) {
            $validated['slug'] = $this->makeUniqueSlug(
                null,
                $validated['title_en'] ?? $event->title_en,
                $event->id
            );
        }

        if (array_key_exists('title_en', $validated) && !array_key_exists('title_hi', $validated)) {
            $validated['title_hi'] = $validated['title_en'];
        }
        if (array_key_exists('title_en', $validated) && !array_key_exists('title_mr', $validated)) {
            $validated['title_mr'] = $validated['title_en'];
        }
        if (array_key_exists('summary_en', $validated) && !array_key_exists('summary_hi', $validated)) {
            $validated['summary_hi'] = $validated['summary_en'];
        }
        if (array_key_exists('description_en', $validated) && !array_key_exists('description_hi', $validated)) {
            $validated['description_hi'] = $validated['description_en'];
        }
        if (array_key_exists('details_en', $validated) && !array_key_exists('details_hi', $validated)) {
            $validated['details_hi'] = $validated['details_en'];
        }
        if (array_key_exists('location_en', $validated) && !array_key_exists('location_hi', $validated)) {
            $validated['location_hi'] = $validated['location_en'];
        }
        if (array_key_exists('time_en', $validated) && !array_key_exists('time_hi', $validated)) {
            $validated['time_hi'] = $validated['time_en'];
        }

        $event->update($validated);

        if ($galleryImageIds !== null) {
            $this->syncGalleryImages($event, $galleryImageIds);
        }

        return response()->json($event->load(['coverImage', 'galleryImages.media']));
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

    private function rules(?Event $event = null): array
    {
        $slugRule = Rule::unique('events', 'slug');
        if ($event) {
            $slugRule->ignore($event->id);
        }

        return [
            'title_en' => [$event ? 'sometimes' : 'required', 'string'],
            'title_hi' => 'nullable|string',
            'title_mr' => 'nullable|string',
            'slug' => ['nullable', 'string', $slugRule],
            'event_date' => 'nullable|date',
            'description_en' => 'nullable|string',
            'description_hi' => 'nullable|string',
            'description_mr' => 'nullable|string',
            'summary_en' => 'nullable|string',
            'summary_hi' => 'nullable|string',
            'summary_mr' => 'nullable|string',
            'details_en' => 'nullable|string',
            'details_hi' => 'nullable|string',
            'details_mr' => 'nullable|string',
            'location_en' => 'nullable|string',
            'location_hi' => 'nullable|string',
            'location_mr' => 'nullable|string',
            'time_en' => 'nullable|string',
            'time_hi' => 'nullable|string',
            'time_mr' => 'nullable|string',
            'category' => [$event ? 'sometimes' : 'required', 'in:Festival,Yatra,Pooja'],
            'image_id' => 'nullable|exists:media,id',
            'gallery_image_ids' => 'nullable|array',
            'gallery_image_ids.*' => 'integer|exists:media,id',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    private function syncGalleryImages(Event $event, array $galleryImageIds): void
    {
        $event->galleryImages()->delete();

        foreach ($galleryImageIds as $index => $mediaId) {
            $event->galleryImages()->create([
                'media_id' => $mediaId,
                'sort_order' => $index,
            ]);
        }
    }

    private function makeUniqueSlug(?string $slug, ?string $titleEn, ?int $ignoreId = null): ?string
    {
        $base = Str::slug($slug ?: $titleEn ?: '');
        if (!$base) {
            return null;
        }

        $candidate = $base;
        $suffix = 2;

        while (
            Event::when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = "{$base}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }
}
