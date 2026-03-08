<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteSetting extends Model
{
    protected $fillable = [
        'temple_name_en',
        'temple_name_hi',
        'temple_name_mr',
        'address_line1_en',
        'address_line1_hi',
        'address_line1_mr',
        'address_line2_en',
        'address_line2_hi',
        'address_line2_mr',
        'address_line3_en',
        'address_line3_hi',
        'address_line3_mr',
        'phone_primary',
        'phone_secondary',
        'email_general',
        'email_pooja',
        'google_maps_embed_url',
        'darshan_morning',
        'darshan_evening',
        'facebook_url',
        'instagram_url',
        'youtube_url',
        'copyright_en',
        'copyright_hi',
        'copyright_mr',
        'site_title',
        'website_name_en',
        'website_name_hi',
        'website_name_mr',
        'favicon_id',
        'logo_id',
        'bank_account_name',
        'bank_name',
        'bank_branch',
        'bank_account_number',
        'bank_ifsc',
        'upi_id',
    ];

    public function favicon(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'favicon_id');
    }

    public function logo(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'logo_id');
    }
}
