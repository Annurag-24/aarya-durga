<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailySchedule extends Model
{
    protected $table = 'daily_schedule';
    protected $fillable = ['time_label', 'event_en', 'event_hi', 'event_mr', 'sort_order'];
}
