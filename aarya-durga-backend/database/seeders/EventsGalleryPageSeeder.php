<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\PageContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventsGalleryPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create media record for events & gallery page hero image
        $heroImageMedia = Media::updateOrCreate(
            ['filename' => 'events_gallery-hero.jpg'],
            [
                'original_name' => 'events_gallery-hero.jpg',
                'file_path' => 'uploads/events_gallery-hero.jpg',
                'file_url' => '/storage/uploads/events_gallery-hero.jpg',
                'file_size' => 98 * 1024, // 98KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        // ========== HERO SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'hero_title'],
            [
                'content_en' => 'Temple Events & Gallery',
                'content_hi' => 'मंदिर कार्यक्रम और गैलरी',
                'content_mr' => 'मंदिर कार्यक्रम आणि गॅलरी',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'hero_subtitle'],
            [
                'content_en' => 'Celebrate the sacred moments and festivities of our beloved Maa Durga temple',
                'content_hi' => 'हमारी प्रिय माँ दुर्गा मंदिर के पवित्र क्षणों और समारोहों का जश्न मनाएं',
                'content_mr' => 'आमच्या प्रिय माँ दुर्गे मंदिराच्या पवित्र क्षणांचा आणि उत्सवांचा जश्न साजरा करा',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'hero_image'],
            [
                'image_id' => $heroImageMedia->id,
            ]
        );

        // ========== TEMPLE EVENTS SECTION ==========
        // Create media records for event images
        $navratriImageMedia = Media::updateOrCreate(
            ['filename' => 'events_gallery-navratri.jpg'],
            [
                'original_name' => 'events_gallery-navratri.jpg',
                'file_path' => 'uploads/events_gallery-navratri.jpg',
                'file_url' => '/storage/uploads/events_gallery-navratri.jpg',
                'file_size' => 100 * 1024, // 100KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        $poojaImageMedia = Media::updateOrCreate(
            ['filename' => 'events_gallery-pooja.jpg'],
            [
                'original_name' => 'events_gallery-pooja.jpg',
                'file_path' => 'uploads/events_gallery-pooja.jpg',
                'file_url' => '/storage/uploads/events_gallery-pooja.jpg',
                'file_size' => 94 * 1024, // 94KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        $yatraImageMedia = Media::updateOrCreate(
            ['filename' => 'events_gallery-yatra.jpg'],
            [
                'original_name' => 'events_gallery-yatra.jpg',
                'file_path' => 'uploads/events_gallery-yatra.jpg',
                'file_url' => '/storage/uploads/events_gallery-yatra.jpg',
                'file_size' => 96 * 1024, // 96KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'events_title'],
            [
                'content_en' => 'Upcoming Temple Events',
                'content_hi' => 'आने वाले मंदिर कार्यक्रम',
                'content_mr' => 'आसन्न मंदिर कार्यक्रम',
            ]
        );

        // Event 1 - Navratri Celebrations
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_1_name'],
            [
                'content_en' => 'Navratri Celebrations',
                'content_hi' => 'नवरात्रि समारोह',
                'content_mr' => 'नवरात्री उत्सव',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_1_date'],
            ['content_en' => '2025-10-01']
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_1_description'],
            [
                'content_en' => 'Nine days of devotion and celebration honoring Maa Durga with special prayers, bhajans, and divine offerings.',
                'content_hi' => 'माँ दुर्गा का सम्मान करते हुए नौ दिनों की भक्ति और समारोह विशेष प्रार्थनाओं, भजनों और दिव्य प्रसाद के साथ।',
                'content_mr' => 'माँ दुर्गेचा सन्मान करून नऊ दिवसांची भक्ती आणि उत्सव विशेष प्रार्थना, भजने आणि दिव्य प्रसाद सह।',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_1_tag'],
            [
                'content_en' => 'Festival',
                'content_hi' => 'त्योहार',
                'content_mr' => 'उत्सव',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_1_image'],
            ['image_id' => $navratriImageMedia->id]
        );

        // Event 2 - Spiritual Journey (Yatra)
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_2_name'],
            [
                'content_en' => 'Spiritual Yatra & Temple Journey',
                'content_hi' => 'आध्यात्मिक यात्रा और मंदिर यात्रा',
                'content_mr' => 'आध्यात्मिक यात्रा आणि मंदिर यात्रा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_2_date'],
            ['content_en' => '2025-11-15']
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_2_description'],
            [
                'content_en' => 'Join our pilgrimage journey to sacred sites with group prayers, spiritual discourse, and devotional activities throughout the day.',
                'content_hi' => 'पवित्र स्थलों के लिए हमारी तीर्थ यात्रा में शामिल हों जिसमें समूह प्रार्थना, आध्यात्मिक व्याख्यान और दिन भर की भक्ति गतिविधियाँ हैं।',
                'content_mr' => 'पवित्र स्थलांकडील आमच्या तीर्थ यात्रेत सामिल व्हा ज्यात समूह प्रार्थना, आध्यात्मिक व्याख्यान आणि दिनभर भक्ती क्रियाकलाप आहेत।',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_2_tag'],
            [
                'content_en' => 'Pilgrimage',
                'content_hi' => 'तीर्थ यात्रा',
                'content_mr' => 'तीर्थ यात्रा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_2_image'],
            ['image_id' => $yatraImageMedia->id]
        );

        // Event 3 - Special Durga Pooja Ritual
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_3_name'],
            [
                'content_en' => 'Special Durga Pooja Ritual',
                'content_hi' => 'विशेष दुर्गा पूजा अनुष्ठान',
                'content_mr' => 'विशेष दुर्गा पूजा अनुष्ठान',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_3_date'],
            ['content_en' => '2025-10-15']
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_3_description'],
            [
                'content_en' => 'Elaborate Durga Pooja ceremony with vedic rituals, sacred chanting, flower offerings, and divine blessings. Limited devotees welcome.',
                'content_hi' => 'वैदिक अनुष्ठान, पवित्र मंत्रोच्चार, फूलों की अर्पणा और दिव्य आशीर्वाद के साथ विस्तृत दुर्गा पूजा समारोह। सीमित भक्तों का स्वागत है।',
                'content_mr' => 'वेदिक अनुष्ठान, पवित्र मंत्रोच्चार, फूलांची अर्पणा आणि दिव्य आशीर्वाद सह विस्तृत दुर्गा पूजा समारोह। मर्यादित भक्तांचे स्वागत आहे।',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_3_tag'],
            [
                'content_en' => 'Ritual',
                'content_hi' => 'अनुष्ठान',
                'content_mr' => 'अनुष्ठान',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'event_3_image'],
            ['image_id' => $poojaImageMedia->id]
        );

        // ========== GALLERY IMAGES SECTION ==========
        // Create media records for gallery images
        $gallery1Media = Media::updateOrCreate(
            ['filename' => 'events_gallery-gallery-1.jpg'],
            [
                'original_name' => 'events_gallery-gallery-1.jpg',
                'file_path' => 'uploads/events_gallery-gallery-1.jpg',
                'file_url' => '/storage/uploads/events_gallery-gallery-1.jpg',
                'file_size' => 102 * 1024, // 102KB
                'mime_type' => 'image/jpeg',
                'width' => 1200,
                'height' => 800,
            ]
        );

        $gallery2Media = Media::updateOrCreate(
            ['filename' => 'events_gallery-gallery-2.jpg'],
            [
                'original_name' => 'events_gallery-gallery-2.jpg',
                'file_path' => 'uploads/events_gallery-gallery-2.jpg',
                'file_url' => '/storage/uploads/events_gallery-gallery-2.jpg',
                'file_size' => 105 * 1024, // 105KB
                'mime_type' => 'image/jpeg',
                'width' => 1200,
                'height' => 800,
            ]
        );

        $gallery3Media = Media::updateOrCreate(
            ['filename' => 'events_gallery-gallery-3.jpg'],
            [
                'original_name' => 'events_gallery-gallery-3.jpg',
                'file_path' => 'uploads/events_gallery-gallery-3.jpg',
                'file_url' => '/storage/uploads/events_gallery-gallery-3.jpg',
                'file_size' => 98 * 1024, // 98KB
                'mime_type' => 'image/jpeg',
                'width' => 1200,
                'height' => 800,
            ]
        );

        $gallery4Media = Media::updateOrCreate(
            ['filename' => 'events_gallery-gallery-4.jpg'],
            [
                'original_name' => 'events_gallery-gallery-4.jpg',
                'file_path' => 'uploads/events_gallery-gallery-4.jpg',
                'file_url' => '/storage/uploads/events_gallery-gallery-4.jpg',
                'file_size' => 101 * 1024, // 101KB
                'mime_type' => 'image/jpeg',
                'width' => 1200,
                'height' => 800,
            ]
        );

        $gallery5Media = Media::updateOrCreate(
            ['filename' => 'events_gallery-gallery-5.jpg'],
            [
                'original_name' => 'events_gallery-gallery-5.jpg',
                'file_path' => 'uploads/events_gallery-gallery-5.jpg',
                'file_url' => '/storage/uploads/events_gallery-gallery-5.jpg',
                'file_size' => 99 * 1024, // 99KB
                'mime_type' => 'image/jpeg',
                'width' => 1200,
                'height' => 800,
            ]
        );

        $gallery6Media = Media::updateOrCreate(
            ['filename' => 'events_gallery-gallery-6.jpg'],
            [
                'original_name' => 'events_gallery-gallery-6.jpg',
                'file_path' => 'uploads/events_gallery-gallery-6.jpg',
                'file_url' => '/storage/uploads/events_gallery-gallery-6.jpg',
                'file_size' => 103 * 1024, // 103KB
                'mime_type' => 'image/jpeg',
                'width' => 1200,
                'height' => 800,
            ]
        );

        // Create PageContent entries for gallery images
        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_1_image'],
            ['image_id' => $gallery1Media->id]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_2_image'],
            ['image_id' => $gallery2Media->id]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_3_image'],
            ['image_id' => $gallery3Media->id]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_4_image'],
            ['image_id' => $gallery4Media->id]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_5_image'],
            ['image_id' => $gallery5Media->id]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_6_image'],
            ['image_id' => $gallery6Media->id]
        );

        // ========== BANNER SECTION ==========
        // Create media record for banner image
        $bannerImageMedia = Media::updateOrCreate(
            ['filename' => 'events_gallery-banner.jpg'],
            [
                'original_name' => 'events_gallery-banner.jpg',
                'file_path' => 'uploads/events_gallery-banner.jpg',
                'file_url' => '/storage/uploads/events_gallery-banner.jpg',
                'file_size' => 242 * 1024, // 242KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'banner_quote'],
            [
                'content_en' => 'Blessed are those who seek the divine light within. May Maa Durga\'s grace illuminate your path and bring peace to your soul.',
                'content_hi' => 'धन्य हैं वे जो अपने भीतर दिव्य प्रकाश की तलाश करते हैं। माँ दुर्गा की कृपा आपके मार्ग को प्रकाशित करे और आपकी आत्मा को शांति दे।',
                'content_mr' => 'आशीर्वादित आहेत ते जे आपल्या अंतर्गत दिव्य प्रकाश शोधतात. माँ दुर्गेचा अनुग्रह आपल्या मार्गाला प्रकाश करो आणि आपल्या आत्म्याला शांती द्या.',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'banner_image'],
            ['image_id' => $bannerImageMedia->id]
        );
    }
}
