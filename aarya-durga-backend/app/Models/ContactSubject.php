<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubject extends Model
{
    protected $fillable = [
        'label_en',
        'label_hi',
        'label_mr',
        'sort_order',
    ];
}
