<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryAlbum;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class GalleryAlbumController extends Controller
{
    public function index()
    {
        return response()->json(
            GalleryAlbum::with(['coverImage', 'media.media'])
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function publicIndex()
    {
        return response()->json(
            GalleryAlbum::with(['coverImage', 'media.media'])
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function publicShowBySlug(string $slug)
    {
        $album = GalleryAlbum::with(['coverImage', 'media.media'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($album);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $mediaIds = $validated['media_ids'] ?? [];
        unset($validated['media_ids']);

        $validated['slug'] = $this->makeUniqueSlug($validated['name_en'] ?? null);
        $validated['name_hi'] = $validated['name_hi'] ?? ($validated['name_en'] ?? '');
        $validated['name_mr'] = $validated['name_mr'] ?? ($validated['name_en'] ?? '');

        $album = GalleryAlbum::create($validated);
        $this->syncMedia($album, $mediaIds);

        return response()->json($album->load(['coverImage', 'media.media']), 201);
    }

    public function show(GalleryAlbum $galleryAlbum)
    {
        return response()->json($galleryAlbum->load(['coverImage', 'media.media']));
    }

    public function update(Request $request, GalleryAlbum $galleryAlbum)
    {
        $validated = $request->validate($this->rules($galleryAlbum));
        $mediaIds = $validated['media_ids'] ?? null;
        unset($validated['media_ids']);

        if (array_key_exists('name_en', $validated)) {
            $validated['slug'] = $this->makeUniqueSlug(
                $validated['name_en'] ?? $galleryAlbum->name_en,
                $galleryAlbum->id
            );
        }

        if (array_key_exists('name_en', $validated) && !array_key_exists('name_hi', $validated)) {
            $validated['name_hi'] = $validated['name_en'];
        }
        if (array_key_exists('name_en', $validated) && !array_key_exists('name_mr', $validated)) {
            $validated['name_mr'] = $validated['name_en'];
        }

        $galleryAlbum->update($validated);

        if ($mediaIds !== null) {
            $this->syncMedia($galleryAlbum, $mediaIds);
        }

        return response()->json($galleryAlbum->load(['coverImage', 'media.media']));
    }

    public function destroy(GalleryAlbum $galleryAlbum)
    {
        $galleryAlbum->delete();
        return response()->json(null, 204);
    }

    public function reorder(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|exists:gallery_albums,id',
            '*.sort_order' => 'required|integer',
        ]);

        foreach ($items as $item) {
            GalleryAlbum::find($item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Albums reordered successfully']);
    }

    private function rules(?GalleryAlbum $album = null): array
    {
        return [
            'name_en' => [$album ? 'sometimes' : 'required', 'string'],
            'name_hi' => 'nullable|string',
            'name_mr' => 'nullable|string',
            'cover_image_id' => 'nullable|exists:media,id',
            'media_ids' => 'nullable|array',
            'media_ids.*' => 'integer|exists:media,id',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    private function syncMedia(GalleryAlbum $album, array $mediaIds): void
    {
        $album->media()->delete();

        foreach ($mediaIds as $index => $mediaId) {
            $album->media()->create([
                'media_id' => $mediaId,
                'sort_order' => $index,
            ]);
        }
    }

    private function makeUniqueSlug(?string $nameEn, ?int $ignoreId = null): ?string
    {
        $base = Str::slug($nameEn ?: '');
        if (!$base) {
            return null;
        }

        $candidate = $base;
        $suffix = 2;

        while (
            GalleryAlbum::when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = "{$base}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }
}
