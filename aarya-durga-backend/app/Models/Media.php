<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'filename',
        'original_name',
        'file_path',
        'file_url',
        'file_size',
        'mime_type',
        'width',
        'height',
    ];
}
