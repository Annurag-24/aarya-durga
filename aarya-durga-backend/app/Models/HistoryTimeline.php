<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HistoryTimeline extends Model
{
    use SoftDeletes;

    protected $table = 'history_timeline';

    protected $fillable = [
        'era_label_en',
        'era_label_hi',
        'era_label_mr',
        'title_en',
        'title_hi',
        'title_mr',
        'description_en',
        'description_hi',
        'description_mr',
        'sort_order',
    ];
}
