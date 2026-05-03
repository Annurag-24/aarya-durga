<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Facility extends Model
{
    use SoftDeletes;

    protected $table = 'facilities';

    protected $fillable = [
        'title_en',
        'title_hi',
        'title_mr',
        'slug',
        'description_en',
        'description_hi',
        'description_mr',
        'image_id',
        'has_details_page',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'has_details_page' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (Facility $facility) {
            if (!$facility->slug && $facility->title_en) {
                $facility->slug = Str::slug($facility->title_en);
            }
        });
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }

    public function media(): HasMany
    {
        return $this->hasMany(FacilityMedia::class)->orderBy('sort_order');
    }
}
