<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Media;
use App\Models\PageContent;
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

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_title'],
            [
                'content_en' => 'Temple Moments',
                'content_hi' => 'मंदिर के पल',
                'content_mr' => 'मंदिराचे क्षण',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'events_gallery', 'section_key' => 'gallery_subtitle'],
            [
                'content_en' => 'Sacred moments and beautiful memories from our temple',
                'content_hi' => 'हमारे मंदिर की पवित्र क्षण और सुंदर यादें',
                'content_mr' => 'आमच्या मंदिरातील पवित्र क्षण आणि सुंदर आठवणी',
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

        $seededEvents = [
            [
                'title_en' => 'Navratri Celebrations',
                'title_hi' => 'नवरात्रि समारोह',
                'title_mr' => 'नवरात्री उत्सव',
                'event_date' => '2025-10-01',
                'summary_en' => 'Nine sacred days of devotion, garlands, bhajans, and evening aarti in honor of Maa Durga.',
                'summary_hi' => 'माँ दुर्गा के सम्मान में नौ पवित्र दिनों की भक्ति, भजन और संध्या आरती।',
                'summary_mr' => 'माँ दुर्गेच्या सन्मानार्थ नऊ पवित्र दिवसांची भक्ती, भजने आणि सायंआरती.',
                'description_en' => 'Nine days of devotion and celebration honoring Maa Durga with special prayers, bhajans, and divine offerings.',
                'description_hi' => 'माँ दुर्गा का सम्मान करते हुए नौ दिनों की भक्ति और समारोह विशेष प्रार्थनाओं, भजनों और दिव्य प्रसाद के साथ।',
                'description_mr' => 'माँ दुर्गेचा सन्मान करून नऊ दिवसांची भक्ती आणि उत्सव विशेष प्रार्थना, भजने आणि दिव्य प्रसाद सह।',
                'details_en' => '<p>Navratri at the temple brings together daily puja, devotional singing, floral decoration, and community darshan. Each evening concludes with a special aarti and prasad distribution.</p>',
                'details_hi' => '<p>मंदिर में नवरात्रि के दौरान दैनिक पूजा, भजन, पुष्प सजावट और सामुदायिक दर्शन आयोजित होते हैं। प्रत्येक संध्या विशेष आरती और प्रसाद वितरण के साथ पूर्ण होती है।</p>',
                'details_mr' => '<p>मंदिरातील नवरात्रीमध्ये दररोज पूजा, भजने, फुलांची सजावट आणि सामुदायिक दर्शन आयोजित केले जाते. प्रत्येक संध्याकाळ विशेष आरती आणि प्रसाद वितरणाने पूर्ण होते.</p>',
                'location_en' => 'Main Temple Courtyard, Aarya Durga Temple',
                'location_hi' => 'मुख्य मंदिर प्रांगण, आर्य दुर्गा मंदिर',
                'location_mr' => 'मुख्य मंदिर प्रांगण, आर्या दुर्गा मंदिर',
                'time_en' => '6:30 PM onwards',
                'time_hi' => 'शाम 6:30 बजे से',
                'time_mr' => 'सायं 6:30 पासून',
                'category' => 'Festival',
                'image_id' => $navratriImageMedia->id,
                'gallery_image_ids' => [
                    $navratriImageMedia->id,
                    $navratriImageMedia->id,
                    $navratriImageMedia->id,
                ],
                'sort_order' => 1,
            ],
            [
                'title_en' => 'Spiritual Yatra & Temple Journey',
                'title_hi' => 'आध्यात्मिक यात्रा और मंदिर यात्रा',
                'title_mr' => 'आध्यात्मिक यात्रा आणि मंदिर यात्रा',
                'event_date' => '2025-11-15',
                'summary_en' => 'A devotional yatra to nearby sacred sites with collective chanting, satsang, and guided temple visits.',
                'summary_hi' => 'सामूहिक जप, सत्संग और पवित्र स्थलों के दर्शन के साथ एक भक्तिमय यात्रा।',
                'summary_mr' => 'सामूहिक जप, सत्संग आणि पवित्र स्थळांच्या दर्शनासह एक भक्तिमय यात्रा.',
                'description_en' => 'Join our pilgrimage journey to sacred sites with group prayers, spiritual discourse, and devotional activities throughout the day.',
                'description_hi' => 'पवित्र स्थलों के लिए हमारी तीर्थ यात्रा में शामिल हों जिसमें समूह प्रार्थना, आध्यात्मिक व्याख्यान और दिन भर की भक्ति गतिविधियाँ हैं।',
                'description_mr' => 'पवित्र स्थलांकडील आमच्या तीर्थ यात्रेत सामिल व्हा ज्यात समूह प्रार्थना, आध्यात्मिक व्याख्यान आणि दिनभर भक्ती क्रियाकलाप आहेत।',
                'details_en' => '<p>This yatra is designed for devotees who wish to deepen their spiritual practice through travel, prayer, and reflection. The day includes temple visits, mantra chanting, and shared meals.</p>',
                'details_hi' => '<p>यह यात्रा उन भक्तों के लिए है जो प्रार्थना, यात्रा और मनन के माध्यम से अपनी साधना को गहरा करना चाहते हैं। इसमें मंदिर दर्शन, मंत्र जप और सामूहिक भोजन शामिल है।</p>',
                'details_mr' => '<p>ही यात्रा प्रार्थना, प्रवास आणि चिंतन यांद्वारे साधना अधिक गहिरी करू इच्छिणाऱ्या भक्तांसाठी आहे. यात मंदिरदर्शन, मंत्रजप आणि सामूहिक भोजन समाविष्ट आहे.</p>',
                'location_en' => 'Temple Departure Gate, Ratnagiri',
                'location_hi' => 'मंदिर प्रस्थान द्वार, रत्नागिरी',
                'location_mr' => 'मंदिर प्रस्थान द्वार, रत्नागिरी',
                'time_en' => '5:30 AM departure',
                'time_hi' => 'सुबह 5:30 बजे प्रस्थान',
                'time_mr' => 'सकाळी 5:30 वाजता प्रस्थान',
                'category' => 'Yatra',
                'image_id' => $yatraImageMedia->id,
                'gallery_image_ids' => [
                    $yatraImageMedia->id,
                    $yatraImageMedia->id,
                    $yatraImageMedia->id,
                ],
                'sort_order' => 2,
            ],
            [
                'title_en' => 'Special Durga Pooja Ritual',
                'title_hi' => 'विशेष दुर्गा पूजा अनुष्ठान',
                'title_mr' => 'विशेष दुर्गा पूजा अनुष्ठान',
                'event_date' => '2025-10-15',
                'summary_en' => 'A focused pooja ceremony with vedic chanting, sacred offerings, and blessings for families and devotees.',
                'summary_hi' => 'वैदिक मंत्रोच्चार, पवित्र अर्पण और परिवारों के लिए आशीर्वाद सहित विशेष पूजा।',
                'summary_mr' => 'वैदिक मंत्रोच्चार, पवित्र अर्पण आणि कुटुंबांसाठी आशीर्वादांसह विशेष पूजा.',
                'description_en' => 'Elaborate Durga Pooja ceremony with vedic rituals, sacred chanting, flower offerings, and divine blessings. Limited devotees welcome.',
                'description_hi' => 'वैदिक अनुष्ठान, पवित्र मंत्रोच्चार, फूलों की अर्पणा और दिव्य आशीर्वाद के साथ विस्तृत दुर्गा पूजा समारोह। सीमित भक्तों का स्वागत है।',
                'description_mr' => 'वेदिक अनुष्ठान, पवित्र मंत्रोच्चार, फूलांची अर्पणा आणि दिव्य आशीर्वाद सह विस्तृत दुर्गा पूजा समारोह। मर्यादित भक्तांचे स्वागत आहे।',
                'details_en' => '<p>The special pooja includes sankalp, kumkum archana, flower offerings, and blessings from the temple priests. Devotees may register families for sankalp participation.</p>',
                'details_hi' => '<p>इस विशेष पूजा में संकल्प, कुमकुम अर्चना, पुष्प अर्पण और पुजारियों का आशीर्वाद शामिल है। भक्त परिवार संकल्प हेतु पंजीकरण कर सकते हैं।</p>',
                'details_mr' => '<p>या विशेष पूजेमध्ये संकल्प, कुंकूम अर्चना, पुष्पअर्पण आणि पुजाऱ्यांचे आशीर्वाद समाविष्ट आहेत. भक्त कुटुंबे संकल्पासाठी नोंदणी करू शकतात.</p>',
                'location_en' => 'Garbha Gruha Hall, Aarya Durga Temple',
                'location_hi' => 'गर्भगृह सभागार, आर्य दुर्गा मंदिर',
                'location_mr' => 'गर्भगृह सभागृह, आर्या दुर्गा मंदिर',
                'time_en' => '10:00 AM to 12:30 PM',
                'time_hi' => 'सुबह 10:00 से दोपहर 12:30 तक',
                'time_mr' => 'सकाळी 10:00 ते दुपारी 12:30',
                'category' => 'Pooja',
                'image_id' => $poojaImageMedia->id,
                'gallery_image_ids' => [
                    $poojaImageMedia->id,
                    $poojaImageMedia->id,
                    $poojaImageMedia->id,
                ],
                'sort_order' => 3,
            ],
        ];

        foreach ($seededEvents as $seededEvent) {
            $galleryImageIds = $seededEvent['gallery_image_ids'];
            unset($seededEvent['gallery_image_ids']);

            $event = Event::updateOrCreate(
                ['title_en' => $seededEvent['title_en']],
                $seededEvent
            );

            $event->galleryImages()->delete();
            foreach ($galleryImageIds as $index => $mediaId) {
                $event->galleryImages()->create([
                    'media_id' => $mediaId,
                    'sort_order' => $index,
                ]);
            }
        }
    }
}
