<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ============================================
// ADMIN AUTH ROUTES (no middleware required)
// ============================================
Route::prefix('admin/auth')->group(function () {
    Route::post('/login', [\App\Http\Controllers\Admin\AuthController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\Admin\AuthController::class, 'logout'])->middleware('admin.auth');
    Route::get('/me', [\App\Http\Controllers\Admin\AuthController::class, 'me'])->middleware('admin.auth');
    Route::post('/refresh', [\App\Http\Controllers\Admin\AuthController::class, 'refresh'])->middleware('admin.auth');
});

// ============================================
// ADMIN CRUD ROUTES (all require admin.auth)
// ============================================
Route::middleware('admin.auth')->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'stats']);

    // Site Settings (singleton)
    Route::get('/site-settings', [\App\Http\Controllers\Admin\SiteSettingsController::class, 'show']);
    Route::put('/site-settings', [\App\Http\Controllers\Admin\SiteSettingsController::class, 'update']);

    // Events
    Route::apiResource('/events', \App\Http\Controllers\Admin\EventController::class);
    Route::post('/events/reorder', [\App\Http\Controllers\Admin\EventController::class, 'reorder']);

    // Gallery
    Route::apiResource('/gallery', \App\Http\Controllers\Admin\GalleryController::class);
    Route::post('/gallery/reorder', [\App\Http\Controllers\Admin\GalleryController::class, 'reorder']);

    // Pooja Services
    Route::apiResource('/pooja-services', \App\Http\Controllers\Admin\PoojaServiceController::class);
    Route::post('/pooja-services/reorder', [\App\Http\Controllers\Admin\PoojaServiceController::class, 'reorder']);

    // Donation Categories
    Route::apiResource('/donation-categories', \App\Http\Controllers\Admin\DonationCategoryController::class);
    Route::post('/donation-categories/reorder', [\App\Http\Controllers\Admin\DonationCategoryController::class, 'reorder']);

    // Daily Schedule
    Route::apiResource('/daily-schedule', \App\Http\Controllers\Admin\DailyScheduleController::class);
    Route::post('/daily-schedule/reorder', [\App\Http\Controllers\Admin\DailyScheduleController::class, 'reorder']);

    // History Timeline
    Route::apiResource('/history-timeline', \App\Http\Controllers\Admin\HistoryTimelineController::class);
    Route::post('/history-timeline/reorder', [\App\Http\Controllers\Admin\HistoryTimelineController::class, 'reorder']);

    // Sacred Traditions
    Route::apiResource('/sacred-traditions', \App\Http\Controllers\Admin\SacredTraditionController::class);
    Route::post('/sacred-traditions/reorder', [\App\Http\Controllers\Admin\SacredTraditionController::class, 'reorder']);

    // Core Values
    Route::apiResource('/core-values', \App\Http\Controllers\Admin\CoreValueController::class);
    Route::post('/core-values/reorder', [\App\Http\Controllers\Admin\CoreValueController::class, 'reorder']);

    // Committee Members
    Route::apiResource('/committee-members', \App\Http\Controllers\Admin\CommitteeMemberController::class);
    Route::post('/committee-members/reorder', [\App\Http\Controllers\Admin\CommitteeMemberController::class, 'reorder']);

    // Page Content
    Route::get('/page-content', [\App\Http\Controllers\Admin\PageContentController::class, 'index']);
    Route::put('/page-content/{pageKey}/{sectionKey}', [\App\Http\Controllers\Admin\PageContentController::class, 'update']);

    // Quotes
    Route::apiResource('/quotes', \App\Http\Controllers\Admin\QuoteController::class);
    Route::post('/quotes/reorder', [\App\Http\Controllers\Admin\QuoteController::class, 'reorder']);

    // Contact Subjects
    Route::apiResource('/contact-subjects', \App\Http\Controllers\Admin\ContactSubjectController::class);
    Route::post('/contact-subjects/reorder', [\App\Http\Controllers\Admin\ContactSubjectController::class, 'reorder']);

    // Contact Submissions
    Route::get('/contact-submissions', [\App\Http\Controllers\Admin\ContactSubmissionController::class, 'index']);
    Route::get('/contact-submissions/{contactSubmission}', [\App\Http\Controllers\Admin\ContactSubmissionController::class, 'show']);
    Route::patch('/contact-submissions/{contactSubmission}/status', [\App\Http\Controllers\Admin\ContactSubmissionController::class, 'updateStatus']);
    Route::delete('/contact-submissions/{contactSubmission}', [\App\Http\Controllers\Admin\ContactSubmissionController::class, 'destroy']);

    // Media
    Route::apiResource('/media', \App\Http\Controllers\Admin\MediaController::class);
    Route::post('/media/upload', [\App\Http\Controllers\Admin\MediaController::class, 'upload']);
});

// ============================================
// PUBLIC READ-ONLY ROUTES (no auth required)
// ============================================
Route::prefix('public')->group(function () {
    Route::get('/settings', [\App\Http\Controllers\Admin\SiteSettingsController::class, 'show']);
    Route::get('/events', [\App\Http\Controllers\Admin\EventController::class, 'index']);
    Route::get('/gallery', [\App\Http\Controllers\Admin\GalleryController::class, 'index']);
    Route::get('/pooja-services', [\App\Http\Controllers\Admin\PoojaServiceController::class, 'index']);
    Route::get('/donation-categories', [\App\Http\Controllers\Admin\DonationCategoryController::class, 'index']);
    Route::get('/daily-schedule', [\App\Http\Controllers\Admin\DailyScheduleController::class, 'index']);
    Route::get('/history-timeline', [\App\Http\Controllers\Admin\HistoryTimelineController::class, 'index']);
    Route::get('/sacred-traditions', [\App\Http\Controllers\Admin\SacredTraditionController::class, 'index']);
    Route::get('/core-values', [\App\Http\Controllers\Admin\CoreValueController::class, 'index']);
    Route::get('/committee-members', [\App\Http\Controllers\Admin\CommitteeMemberController::class, 'index']);
    Route::get('/page-content/{pageKey}', [\App\Http\Controllers\Admin\PageContentController::class, 'show']);
    Route::get('/page-content/{pageKey}/{sectionKey}', [\App\Http\Controllers\Admin\PageContentController::class, 'showSection']);
    Route::get('/quotes/{placement}', [\App\Http\Controllers\Admin\QuoteController::class, 'byPlacement']);
    Route::get('/contact-subjects', [\App\Http\Controllers\Admin\ContactSubjectController::class, 'index']);
    Route::post('/contact', [\App\Http\Controllers\Public\ContactController::class, 'store']);
});
