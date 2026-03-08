<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gallery extends Model
{
    use SoftDeletes;

    protected $table = 'gallery_images';
    protected $fillable = ['image_id', 'alt_en', 'alt_hi', 'alt_mr', 'caption_en', 'caption_hi', 'caption_mr', 'sort_order'];
}
