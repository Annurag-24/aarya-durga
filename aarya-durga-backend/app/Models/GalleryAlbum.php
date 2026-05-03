<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class GalleryAlbum extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name_en',
        'name_hi',
        'name_mr',
        'slug',
        'cover_image_id',
        'sort_order',
        'is_active',
    ];

    protected static function booted(): void
    {
        static::saving(function (GalleryAlbum $album) {
            if (!$album->slug && $album->name_en) {
                $album->slug = Str::slug($album->name_en);
            }
        });
    }

    public function coverImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'cover_image_id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(GalleryAlbumMedia::class, 'album_id')->orderBy('sort_order');
    }
}
