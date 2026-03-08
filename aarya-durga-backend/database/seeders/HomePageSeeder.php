<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\PageContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HomePageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create media record for hero background image
        $heroMedia = Media::firstOrCreate(
            ['filename' => 'home-hero.jpg'],
            [
                'original_name' => 'home-hero.jpg',
                'file_path' => 'uploads/home-hero.jpg',
                'file_url' => '/storage/uploads/home-hero.jpg',
                'file_size' => 477 * 1024, // 477KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        // Create media record for about section image
        $aboutMedia = Media::updateOrCreate(
            ['filename' => 'home-about.jpg'],
            [
                'original_name' => 'home-about.jpg',
                'file_path' => 'uploads/home-about.jpg',
                'file_url' => '/storage/uploads/home-about.jpg',
                'file_size' => 120 * 1024, // 120KB (actual file size)
                'mime_type' => 'image/jpeg',
                'width' => 800,
                'height' => 800,
            ]
        );

        // Create media record for blessing section image
        $blessingMedia = Media::updateOrCreate(
            ['filename' => 'home-blessing.jpg'],
            [
                'original_name' => 'home-blessing.jpg',
                'file_path' => 'uploads/home-blessing.jpg',
                'file_url' => '/storage/uploads/home-blessing.jpg',
                'file_size' => 237 * 1024, // 237KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1280,
            ]
        );

        // Create media record for visit section background image
        $visitMedia = Media::updateOrCreate(
            ['filename' => 'home-visit.jpg'],
            [
                'original_name' => 'home-visit.jpg',
                'file_path' => 'uploads/home-visit.jpg',
                'file_url' => '/storage/uploads/home-visit.jpg',
                'file_size' => 477 * 1024, // 477KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        // Hero Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'hero_title'],
            [
                'content_en' => 'Aarya Durga Temple',
                'content_hi' => 'आर्य दुर्गा मंदिर',
                'content_mr' => 'आर्य दुर्गा मंदिर',
            ]
        );

        // Hero Subtitle
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'hero_subtitle'],
            [
                'content_en' => 'Revered Mother of the Universe',
                'content_hi' => 'ब्रह्मांड की पूजनीय माता',
                'content_mr' => 'विश्वाची पूजनीय माता',
            ]
        );

        // Hero Description
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'hero_description'],
            [
                'content_en' => 'Discover the divine presence of Goddess Durga in our sacred temple, where centuries of devotion meet modern spirituality.',
                'content_hi' => 'हमारे पवित्र मंदिर में देवी दुर्गा की दिव्य उपस्थिति की खोज करें, जहां सदियों की भक्ति आधुनिक आध्यात्मिकता से मिलती है।',
                'content_mr' => 'आमच्या पवित्र मंदिरात देवी दुर्गा यांच्या दिव्य उपस्थितीचा शोध घ्या, जेथे शतकांची भक्ती आधुनिक आध्यात्मिकतेशी मिळते।',
            ]
        );

        // Hero Background Image
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'hero_image'],
            [
                'image_id' => $heroMedia->id,
            ]
        );

        // About Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'about_title'],
            [
                'content_en' => 'About Aarya Durga Temple',
                'content_hi' => 'आर्य दुर्गा मंदिर के बारे में',
                'content_mr' => 'आर्य दुर्गा मंदिराबद्दल',
            ]
        );

        // About Description
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'about_description'],
            [
                'content_en' => 'Aarya Durga Temple stands as a beacon of spiritual enlightenment and cultural heritage. Built with devotion and maintained with reverence, this sacred space welcomes devotees from all walks of life. With centuries of history and countless miracles witnessed within these walls, the temple continues to be a source of inspiration and solace for millions.',
                'content_hi' => 'आर्य दुर्गा मंदिर आध्यात्मिक ज्ञान और सांस्कृतिक विरासत का प्रतीक है। भक्ति के साथ निर्मित और सम्मान के साथ संरक्षित, यह पवित्र स्थान सभी वर्गों के भक्तों का स्वागत करता है। सदियों के इतिहास और इन दीवारों के भीतर साक्षी किए गए अनगिनत चमत्कारों के साथ, मंदिर लाखों लोगों के लिए प्रेरणा और सांत्वना का स्रोत बना हुआ है।',
                'content_mr' => 'आर्य दुर्गा मंदिर आध्यात्मिक प्रबोधन आणि सांस्कृतिक वारसाचे प्रतीक आहे। भक्तीने बांधलेले आणि श्रद्धेने संरक्षित, हे पवित्र स्थान सर्व वर्गांच्या भक्तांचे स्वागत करते। शतकांचा इतिहास आणि या भिंतींमधील साक्षीदार असलेले अनंत चमत्कार, मंदिर लाखो लोकांसाठी प्रेरणा आणि सांत्वनाचा स्रोत बनून राहिले आहे।',
            ]
        );

        // About Section Image
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'about_image'],
            [
                'image_id' => $aboutMedia->id,
            ]
        );

        // Blessing Section Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'blessing_title'],
            [
                'content_en' => 'Divine Blessings',
                'content_hi' => 'दिव्य आशीर्वाद',
                'content_mr' => 'दिव्य आशीर्वाद',
            ]
        );

        // Blessing Banner Content
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'blessing_content'],
            [
                'content_en' => 'May the divine blessings of Aarya Durga shield and guide you through all moments of your life.',
                'content_hi' => 'आर्य दुर्गा के दिव्य आशीर्वाद आपके जीवन के हर पल में आपकी रक्षा और मार्गदर्शन करें।',
                'content_mr' => 'आर्य दुर्गा यांचे दिव्य आशीर्वाद आपल्या जीवनातील प्रत्येक क्षणी आपली रक्षा आणि मार्गदर्शन करो।',
            ]
        );

        // Blessing Section Image
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'blessing_image'],
            [
                'image_id' => $blessingMedia->id,
            ]
        );

        // History Section Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_title'],
            [
                'content_en' => 'Our Rich Heritage',
                'content_hi' => 'हमारी समृद्ध विरासत',
                'content_mr' => 'आमचा समृद्ध वारसा',
            ]
        );

        // History Section Description
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_description'],
            [
                'content_en' => 'Aarya Durga Temple has stood as a beacon of spirituality for centuries, evolving with changing times while maintaining its sacred traditions.',
                'content_hi' => 'आर्य दुर्गा मंदिर सदियों से आध्यात्मिकता का प्रतीक रहा है, समय के साथ विकसित होते हुए भी अपनी पवित्र परंपराओं को बनाए रखा है।',
                'content_mr' => 'आर्य दुर्गा मंदिर शतकांच्या आध्यात्मिकतेचे प्रतीक राहिले आहे, बदलत्या काळाशी विकसित होत असूनही त्याच्या पवित्र परंपरांना अक्षुण्ण ठेवले आहे।',
            ]
        );

        // History Card 1 Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_card1_title'],
            [
                'content_en' => 'Establishment Era',
                'content_hi' => 'स्थापना काल',
                'content_mr' => 'स्थापना काल',
            ]
        );

        // History Card 1 Description
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_card1_description'],
            [
                'content_en' => 'Founded with devotion and faith, the temple was established to serve the spiritual needs of our community and preserve sacred traditions.',
                'content_hi' => 'भक्ति और आस्था के साथ स्थापित, मंदिर हमारे समुदाय की आध्यात्मिक जरूरतों को पूरा करने और पवित्र परंपराओं को संरक्षित करने के लिए बनाया गया था।',
                'content_mr' => 'भक्ती आणि विश्वासाने स्थापित, मंदिर आमच्या समुदायाच्या आध्यात्मिक गरजा पूर्ण करण्यासाठी आणि पवित्र परंपरांचे संरक्षण करण्यासाठी बनवले गेले होते।',
            ]
        );

        // History Card 2 Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_card2_title'],
            [
                'content_en' => 'Sacred Traditions',
                'content_hi' => 'पवित्र परंपराएं',
                'content_mr' => 'पवित्र परंपरा',
            ]
        );

        // History Card 2 Description
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_card2_description'],
            [
                'content_en' => 'Through the ages, we have maintained age-old rituals and practices that honor the divine mother and strengthen our spiritual connection.',
                'content_hi' => 'युगों से, हमने पुरानी रीति-रिवाजों और प्रथाओं को बनाए रखा है जो दिव्य माता को सम्मानित करती हैं और हमारे आध्यात्मिक संबंध को मजबूत करती हैं।',
                'content_mr' => 'युगांभरी, आम्ही प्राचीन विधी आणि प्रथा अक्षुण्ण ठेवल्या आहेत जे दिव्य माता यांचा सन्मान करतात आणि आमचे आध्यात्मिक संबंध शक्तिशाली करतात।',
            ]
        );

        // History Card 3 Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_card3_title'],
            [
                'content_en' => 'Navratri Celebrations',
                'content_hi' => 'नवरात्रि समारोह',
                'content_mr' => 'नवरात्रि साजरे',
            ]
        );

        // History Card 3 Description
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'history_card3_description'],
            [
                'content_en' => 'Every Navratri, the temple comes alive with vibrant celebrations, bringing together thousands of devotees in reverence and joy.',
                'content_hi' => 'हर नवरात्रि, मंदिर जीवंत उत्सवों से जीवंत हो जाता है, हजारों भक्तों को श्रद्धा और आनंद में एकत्रित करता है।',
                'content_mr' => 'प्रत्येक नवरात्रीला, मंदिर जीवंत उत्सवांने जीवंत होते, हजारो भक्तांना श्रद्धा आणि आनंदात एकत्र करते।',
            ]
        );

        // Temple Events Section Title
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'events_title'],
            [
                'content_en' => 'Temple Festivals & Events',
                'content_hi' => 'आने वाले मंदिर कार्यक्रम',
                'content_mr' => 'आसन्न मंदिर कार्यक्रम',
            ]
        );

        // Temple Events Section Description
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'events_description'],
            [
                'content_en' => 'Join us in celebrating the divine through festivals, rituals, and community gatherings.',
                'content_hi' => 'पूरे साल हमारे सबसे महत्वपूर्ण मंदिर कार्यक्रमों और त्योहारों पर हमारे साथ मनाएं। हजारों भक्तों के साथ पवित्र समारोहों और आध्यात्मिक अनुभवों में शामिल हों।',
                'content_mr' => 'वर्षभर आमच्या सर्वात महत्वाच्या मंदिर कार्यक्रमांमध्ये आणि उत्सवांमध्ये आमच्या सोबत साजरे करा। हजारो भक्तांसह पवित्र समारोहात आणि आध्यात्मिक अनुभवांमध्ये सामील व्हा।',
            ]
        );

        // Visit Section Heading
        PageContent::firstOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_heading'],
            [
                'content_en' => 'Plan Your Divine Visit',
                'content_hi' => 'अपनी दिव्य यात्रा की योजना बनाएं',
                'content_mr' => 'आपल्या दिव्य भेटीची योजना करा',
            ]
        );

        // Visit Section - Darshan Times (NON-TRANSLATABLE: Times are same in all languages)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_darshan_morning_start'],
            [
                'content_en' => '6:00 AM',
                'content_hi' => '6:00 AM',
                'content_mr' => '6:00 AM',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_darshan_morning_end'],
            [
                'content_en' => '12:00 PM',
                'content_hi' => '12:00 PM',
                'content_mr' => '12:00 PM',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_darshan_evening_start'],
            [
                'content_en' => '5:00 PM',
                'content_hi' => '5:00 PM',
                'content_mr' => '5:00 PM',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_darshan_evening_end'],
            [
                'content_en' => '9:00 PM',
                'content_hi' => '9:00 PM',
                'content_mr' => '9:00 PM',
            ]
        );

        // Visit Section - Temple Name (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_temple_name'],
            [
                'content_en' => 'Aarya Durga Temple',
                'content_hi' => 'आर्य दुर्गा मंदिर',
                'content_mr' => 'आर्य दुर्गा मंदिर',
            ]
        );

        // Visit Section - Address (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_address'],
            [
                'content_en' => 'Devi Hasol Road, Devihasol, Sindhudurg District, Maharashtra 416713, India',
                'content_hi' => 'देवी हसोल रोड, देविहसोल, सिंधुदुर्ग जिला, महाराष्ट्र 416713, भारत',
                'content_mr' => 'देवी हसोल रोड, देविहसोल, सिंधुदुर्ग जिल्हा, महाराष्ट्र 416713, भारत',
            ]
        );

        // Visit Section - Phone (NON-TRANSLATABLE: Phone numbers are same in all languages)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_phone'],
            [
                'content_en' => '+91 9769907461 / +91 9404151883',
                'content_hi' => '+91 9769907461 / +91 9404151883',
                'content_mr' => '+91 9769907461 / +91 9404151883',
            ]
        );

        // Visit Section - Email (NON-TRANSLATABLE: Email is same in all languages)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_email'],
            [
                'content_en' => 'shreeaaryadurgadevi@gmail.com',
                'content_hi' => 'shreeaaryadurgadevi@gmail.com',
                'content_mr' => 'shreeaaryadurgadevi@gmail.com',
            ]
        );

        // Visit Section - GPS Coordinates (NON-TRANSLATABLE: Coordinates are same in all languages)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_latitude'],
            [
                'content_en' => '16.7386302',
                'content_hi' => '16.7386302',
                'content_mr' => '16.7386302',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_longitude'],
            [
                'content_en' => '73.4323744',
                'content_hi' => '73.4323744',
                'content_mr' => '73.4323744',
            ]
        );

        // Visit Section Background Image
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'visit_image'],
            [
                'image_id' => $visitMedia->id,
            ]
        );

        // Footer Title / Devotional Quote (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'footer_title'],
            [
                'content_en' => 'Where there is devotion, there is divine power.',
                'content_hi' => 'जहां भक्ति है, वहां दिव्य शक्ति है।',
                'content_mr' => 'जेथे भक्ती आहे, तेथे दिव्य शक्ती आहे।',
            ]
        );

        // Footer Social Section Label (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'footer_social_label'],
            [
                'content_en' => 'Follow Us',
                'content_hi' => 'हमें फॉलो करें',
                'content_mr' => 'आमच्या फॉलो करा',
            ]
        );

        // Footer Social Links (NON-TRANSLATABLE: URLs are same in all languages)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'footer_facebook_link'],
            [
                'content_en' => 'https://www.facebook.com/shreeaaryadurga/',
                'content_hi' => 'https://www.facebook.com/shreeaaryadurga/',
                'content_mr' => 'https://www.facebook.com/shreeaaryadurga/',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'footer_youtube_link'],
            [
                'content_en' => 'https://www.youtube.com/watch?v=oRa-YGFAJGg',
                'content_hi' => 'https://www.youtube.com/watch?v=oRa-YGFAJGg',
                'content_mr' => 'https://www.youtube.com/watch?v=oRa-YGFAJGg',
            ]
        );

        // Footer Copyright (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'footer_copyright'],
            [
                'content_en' => '© Aarya Durga Temple, Wagde, Kankavli. All rights reserved.',
                'content_hi' => '© आर्य दुर्गा मंदिर, वाघडे, कांकवली। सर्वाधिकार सुरक्षित।',
                'content_mr' => '© आर्य दुर्गा मंदिर, वाघडे, कांकवली. सर्व हक्क राखीव.',
            ]
        );

    }
}
