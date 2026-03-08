<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Site Settings
        \App\Models\SiteSetting::create([
            'temple_name_en' => 'Aarya Durga Temple',
            'temple_name_hi' => 'आर्य दुर्गा मंदिर',
            'temple_name_mr' => 'आर्य दुर्गा मंदिर',
            'address_line1_en' => 'Wagde, Kankavli',
            'address_line1_hi' => 'वाग्डे, कांकवली',
            'address_line1_mr' => 'वाग्डे, कांकवली',
            'address_line2_en' => 'Sindhudurg District',
            'address_line2_hi' => 'सिंधुदुर्ग जिला',
            'address_line2_mr' => 'सिंधुदुर्ग जिला',
            'address_line3_en' => 'Maharashtra, India',
            'address_line3_hi' => 'महाराष्ट्र, भारत',
            'address_line3_mr' => 'महाराष्ट्र, भारत',
            'phone_primary' => '+91 98765 43210',
            'phone_secondary' => '+91 98765 43211',
            'email_general' => 'info@aaryadurgatemple.com',
            'email_pooja' => 'pooja@aaryadurgatemple.com',
            'darshan_morning' => '5:00 AM - 12:00 PM',
            'darshan_evening' => '3:00 PM - 8:00 PM',
            'facebook_url' => 'https://facebook.com/aaryadurgatemple',
            'instagram_url' => 'https://instagram.com/aaryadurgatemple',
            'youtube_url' => 'https://youtube.com/aaryadurgatemple',
            'copyright_en' => '© 2026 Aarya Durga Temple. All rights reserved.',
            'copyright_hi' => '© 2026 आर्य दुर्गा मंदिर। सर्वाधिकार सुरक्षित।',
            'copyright_mr' => '© 2026 आर्य दुर्गा मंदिर। सर्व अधिकार सुरक्षित।',
        ]);

        // Events
        \App\Models\Event::create([
            'title_en' => 'Navratri Festival',
            'title_hi' => 'नवरात्रि पर्व',
            'title_mr' => 'नवरात्रि उत्सव',
            'date_label_en' => 'October 2026',
            'date_label_hi' => 'अक्टूबर 2026',
            'date_label_mr' => 'ऑक्टोबर 2026',
            'event_date' => '2026-10-01',
            'description_en' => 'Nine-day festival celebrating Goddess Durga',
            'description_hi' => 'देवी दुर्गा का नौ दिवसीय पर्व',
            'description_mr' => 'देवी दुर्गेचे नव दिवसांचे उत्सव',
            'category' => 'Festival',
            'is_active' => 1,
            'sort_order' => 1,
        ]);

        // Pooja Services
        \App\Models\PoojaService::create([
            'title_en' => 'Aarti Pooja',
            'title_hi' => 'आरती पूजा',
            'title_mr' => 'आरती पूजा',
            'schedule_en' => 'Daily: 6 AM, 12 PM, 6 PM',
            'schedule_hi' => 'दैनिक: 6 AM, 12 PM, 6 PM',
            'schedule_mr' => 'दैनिक: 6 AM, 12 PM, 6 PM',
            'description_en' => 'Traditional lamp worship ceremony',
            'description_hi' => 'परंपरागत दीप पूजा समारोह',
            'description_mr' => 'परंपरागत दिवा पूजा समारंभ',
            'price' => '₹101',
            'is_active' => 1,
            'sort_order' => 1,
        ]);

        // Donation Categories
        \App\Models\DonationCategory::create([
            'title_en' => 'Temple Maintenance',
            'title_hi' => 'मंदिर रखरखाव',
            'title_mr' => 'मंदिर देखभाल',
            'description_en' => 'Contribute to temple upkeep and maintenance',
            'description_hi' => 'मंदिर की देखभाल में योगदान दें',
            'description_mr' => 'मंदिरच्या देखभालीसाठी योगदान करा',
            'suggested_amount' => '₹501',
            'is_active' => 1,
            'sort_order' => 1,
        ]);

        // Daily Schedule
        \App\Models\DailySchedule::create([
            'time_label' => '5:00 AM',
            'event_en' => 'Temple Opening & Morning Prayers',
            'event_hi' => 'मंदिर खोलना और प्रातः प्रार्थना',
            'event_mr' => 'मंदिर उघडणे आणि सकाळचे प्रार्थना',
            'sort_order' => 1,
        ]);

        // Core Values
        \App\Models\CoreValue::create([
            'title_en' => 'Devotion',
            'title_hi' => 'भक्ति',
            'title_mr' => 'भक्ती',
            'description_en' => 'Strong faith and devotion to Goddess Durga',
            'description_hi' => 'देवी दुर्गा के प्रति दृढ़ विश्वास और भक्ति',
            'description_mr' => 'देवी दुर्गेप्रती दृढ़ विश्वास आणि भक्ती',
            'sort_order' => 1,
        ]);

        // Quotes
        \App\Models\Quote::create([
            'quote_en' => 'May Goddess Durga bless us with courage and strength',
            'quote_hi' => 'माता दुर्गा हमें साहस और शक्ति प्रदान करें',
            'quote_mr' => 'देवी दुर्गे आम्हाला साहस आणि शक्ती प्रदान करावी',
            'placement' => 'home_blessing',
            'is_active' => 1,
        ]);

        // Contact Subjects
        \App\Models\ContactSubject::create([
            'label_en' => 'General Inquiry',
            'label_hi' => 'सामान्य पूछताछ',
            'label_mr' => 'सामान्य चौकशी',
            'sort_order' => 1,
        ]);
    }
}
