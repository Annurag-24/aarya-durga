<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Event extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title_en',
        'title_hi',
        'title_mr',
        'slug',
        'event_date',
        'description_en',
        'description_hi',
        'description_mr',
        'summary_en',
        'summary_hi',
        'summary_mr',
        'details_en',
        'details_hi',
        'details_mr',
        'location_en',
        'location_hi',
        'location_mr',
        'time_en',
        'time_hi',
        'time_mr',
        'category',
        'image_id',
        'is_active',
        'sort_order',
    ];

    protected static function booted(): void
    {
        static::saving(function (Event $event) {
            if (!$event->slug && $event->title_en) {
                $event->slug = Str::slug($event->title_en);
            }
        });
    }

    public function coverImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(EventImage::class)->orderBy('sort_order');
    }
}
