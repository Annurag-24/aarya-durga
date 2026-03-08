<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $table = 'page_content';
    protected $fillable = ['page_key', 'section_key', 'image_id', 'content_en', 'content_hi', 'content_mr'];

    public function image()
    {
        return $this->belongsTo(Media::class, 'image_id');
    }
}
