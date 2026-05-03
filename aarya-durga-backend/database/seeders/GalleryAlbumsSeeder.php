<?php

namespace Database\Seeders;

use App\Models\GalleryAlbum;
use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryAlbumsSeeder extends Seeder
{
    public function run(): void
    {
        $albums = [
            [
                'name_en' => 'Festival Celebrations',
                'name_mr' => 'उत्सव सोहळे',
                'cover' => 'album-festival-1.jpg',
                'media' => [
                    'album-festival-1.jpg',
                    'album-festival-2.jpg',
                    'album-festival-3.jpg',
                    'album-festival-4.jpg',
                ],
            ],
            [
                'name_en' => 'Daily Aarti',
                'name_mr' => 'दैनिक आरती',
                'cover' => 'album-aarti-1.jpg',
                'media' => [
                    'album-aarti-1.jpg',
                    'album-aarti-2.jpg',
                    'album-aarti-3.jpg',
                    'album-aarti-4.jpg',
                ],
            ],
            [
                'name_en' => 'Temple Architecture',
                'name_mr' => 'मंदिर वास्तुकला',
                'cover' => 'album-architecture-1.jpg',
                'media' => [
                    'album-architecture-1.jpg',
                    'album-architecture-2.jpg',
                    'album-architecture-3.jpg',
                    'album-architecture-4.jpg',
                ],
            ],
        ];

        foreach ($albums as $albumIndex => $data) {
            $coverMedia = $this->ensureMedia($data['cover']);

            $album = GalleryAlbum::updateOrCreate(
                ['slug' => Str::slug($data['name_en'])],
                [
                    'name_en' => $data['name_en'],
                    'name_hi' => $data['name_en'],
                    'name_mr' => $data['name_mr'],
                    'cover_image_id' => $coverMedia->id,
                    'sort_order' => $albumIndex,
                    'is_active' => true,
                ]
            );

            $album->media()->delete();

            foreach ($data['media'] as $mediaIndex => $filename) {
                $media = $this->ensureMedia($filename);
                $album->media()->create([
                    'media_id' => $media->id,
                    'sort_order' => $mediaIndex,
                ]);
            }
        }
    }

    private function ensureMedia(string $filename): Media
    {
        $path = 'media/' . $filename;
        $size = Storage::disk('public')->exists($path)
            ? Storage::disk('public')->size($path)
            : 0;

        return Media::firstOrCreate(
            ['filename' => $filename],
            [
                'original_name' => $filename,
                'mime_type' => 'image/jpeg',
                'file_size' => $size,
                'file_path' => $path,
                'file_url' => Storage::url($path),
            ]
        );
    }
}
