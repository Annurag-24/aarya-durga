<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteSettingsController extends Controller
{
    public function show()
    {
        $settings = SiteSetting::first();

        if (!$settings) {
            $settings = SiteSetting::create([]);
        }

        return response()->json($settings->load(['favicon', 'logo']));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'temple_name_en' => 'nullable|string',
            'temple_name_hi' => 'nullable|string',
            'temple_name_mr' => 'nullable|string',
            'address_line1_en' => 'nullable|string',
            'address_line1_hi' => 'nullable|string',
            'address_line1_mr' => 'nullable|string',
            'address_line2_en' => 'nullable|string',
            'address_line2_hi' => 'nullable|string',
            'address_line2_mr' => 'nullable|string',
            'address_line3_en' => 'nullable|string',
            'address_line3_hi' => 'nullable|string',
            'address_line3_mr' => 'nullable|string',
            'phone_primary' => 'nullable|string',
            'phone_secondary' => 'nullable|string',
            'email_general' => 'nullable|email',
            'email_pooja' => 'nullable|email',
            'google_maps_embed_url' => 'nullable|string',
            'darshan_morning' => 'nullable|string',
            'darshan_evening' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'copyright_en' => 'nullable|string',
            'copyright_hi' => 'nullable|string',
            'copyright_mr' => 'nullable|string',
            'site_title' => 'nullable|string|max:255',
            'website_name_en' => 'nullable|string|max:100',
            'website_name_hi' => 'nullable|string|max:100',
            'website_name_mr' => 'nullable|string|max:100',
            'favicon_id' => 'nullable|integer|exists:media,id',
            'logo_id' => 'nullable|integer|exists:media,id',
            'bank_account_name' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'bank_branch' => 'nullable|string',
            'bank_account_number' => 'nullable|string',
            'bank_ifsc' => 'nullable|string',
            'upi_id' => 'nullable|string',
        ]);

        $settings = SiteSetting::firstOrCreate([]);
        $settings->update($validated);

        return response()->json($settings->load(['favicon', 'logo']));
    }
}
