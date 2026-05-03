<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class BankDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'account_name',
        'bank_name',
        'branch',
        'account_number',
        'ifsc_code',
        'upi_id',
        'qr_image_id',
        'sort_order',
    ];

    public function qrImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'qr_image_id');
    }
}
