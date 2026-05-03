<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SacredTradition extends Model
{
    protected $fillable = [
        'title_en',
        'title_hi',
        'title_mr',
        'description_en',
        'description_hi',
        'description_mr',
        'sort_order',
    ];
}
