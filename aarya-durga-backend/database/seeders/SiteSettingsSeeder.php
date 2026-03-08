<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or get favicon media record
        $favicon = Media::firstOrCreate(
            ['filename' => 'favicon.png'],
            [
                'original_name' => 'favicon.png',
                'file_path' => '/uploads/favicon.png',
                'file_url' => '/storage/uploads/favicon.png',
                'file_size' => null,
                'mime_type' => 'image/png',
                'width' => 512,
                'height' => 512,
            ]
        );

        // Create or get logo media record
        $logo = Media::firstOrCreate(
            ['filename' => 'logo.png'],
            [
                'original_name' => 'logo.png',
                'file_path' => '/uploads/logo.png',
                'file_url' => '/storage/uploads/logo.png',
                'file_size' => null,
                'mime_type' => 'image/png',
                'width' => 512,
                'height' => 512,
            ]
        );

        // Create or update site settings
        SiteSetting::updateOrCreate(
            [],
            [
                'site_title' => 'Aarya Durga Temple | Wagde, Kankavli – Sacred Place of Devotion',
                'website_name_en' => 'Aarya Durga Temple',
                'website_name_hi' => 'आर्य दुर्गा मंदिर',
                'website_name_mr' => 'आर्य दुर्गा मंदिर',
                'favicon_id' => $favicon->id,
                'logo_id' => $logo->id,
                'temple_name_en' => 'Aarya Durga Temple',
                'temple_name_hi' => 'आर्य दुर्गा मंदिर',
                'temple_name_mr' => 'आर्य दुर्गा मंदिर',
                'address_line1_en' => 'Wagde, Kankavli',
                'address_line1_hi' => 'वाडे, कणकवली',
                'address_line1_mr' => 'वाडे, कणकवली',
                'address_line2_en' => 'Sindhudurg District',
                'address_line2_hi' => 'सिंधुदुर्ग जिला',
                'address_line2_mr' => 'सिंधुदुर्ग जिला',
                'address_line3_en' => 'Maharashtra, India',
                'address_line3_hi' => 'महाराष्ट्र, भारत',
                'address_line3_mr' => 'महाराष्ट्र, भारत',
                'phone_primary' => '+91 9876543210',
                'phone_secondary' => '+91 9876543211',
                'email_general' => 'info@aaryadurgatemple.com',
                'email_pooja' => 'pooja@aaryadurgatemple.com',
                'darshan_morning' => '6:00 AM - 12:00 PM',
                'darshan_evening' => '4:00 PM - 9:00 PM',
                'facebook_url' => 'https://facebook.com/aaryadurgatemple',
                'instagram_url' => 'https://instagram.com/aaryadurgatemple',
                'youtube_url' => 'https://youtube.com/@aaryadurgatemple',
                'copyright_en' => '© 2026 Aarya Durga Temple. All rights reserved.',
                'copyright_hi' => '© 2026 आर्य दुर्गा मंदिर। सर्वाधिकार सुरक्षित।',
                'copyright_mr' => '© 2026 आर्य दुर्गा मंदिर। सर्वाधिकार सुरक्षित।',
                'bank_account_name' => 'Aarya Durga Temple Trust',
                'bank_name' => 'Bank of Maharashtra',
                'bank_branch' => 'Kankavli Branch',
                'bank_account_number' => '20034455667',
                'bank_ifsc' => 'MAHB0000123',
                'upi_id' => 'aaryadurgatemple@bankname',
            ]
        );
    }
}
