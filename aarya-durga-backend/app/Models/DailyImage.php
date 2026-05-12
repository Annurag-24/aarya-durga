<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyImage extends Model
{
    protected $table = 'daily_image';

    protected $fillable = [
        'image_id',
        'caption_en',
        'caption_hi',
        'caption_mr',
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }
}
