<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Gallery;
use App\Models\PoojaService;
use App\Models\DonationCategory;
use App\Models\DailySchedule;
use App\Models\HistoryTimeline;
use App\Models\SacredTradition;
use App\Models\CoreValue;
use App\Models\CommitteeMember;
use App\Models\Quote;
use App\Models\ContactSubject;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'events' => Event::count(),
            'galleries' => Gallery::count(),
            'pooja_services' => PoojaService::count(),
            'donation_categories' => DonationCategory::count(),
            'daily_schedules' => DailySchedule::count(),
            'history_timelines' => HistoryTimeline::count(),
            'sacred_traditions' => SacredTradition::count(),
            'core_values' => CoreValue::count(),
            'committee_members' => CommitteeMember::count(),
            'quotes' => Quote::count(),
            'contact_subjects' => ContactSubject::count(),
        ]);
    }
}
