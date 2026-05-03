<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommitteeMember extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name_en',
        'name_hi',
        'name_mr',
        'role_en',
        'role_hi',
        'role_mr',
        'address_en',
        'address_hi',
        'address_mr',
        'phone',
        'photo_id',
        'bio_en',
        'bio_hi',
        'bio_mr',
        'sort_order',
    ];

    public function photo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'photo_id');
    }
}
