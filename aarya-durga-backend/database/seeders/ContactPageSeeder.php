<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\PageContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create media record for contact page hero image
        $heroImageMedia = Media::updateOrCreate(
            ['filename' => 'contact-hero.jpg'],
            [
                'original_name' => 'contact-hero.jpg',
                'file_path' => 'uploads/contact-hero.jpg',
                'file_url' => '/storage/uploads/contact-hero.jpg',
                'file_size' => 120 * 1024, // 120KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        // ========== HERO SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'hero_title'],
            [
                'content_en' => 'Contact Us',
                'content_hi' => 'हमसे संपर्क करें',
                'content_mr' => 'आमच्याशी संपर्क साधा',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'hero_subtitle'],
            [
                'content_en' => 'Reach out to us with your questions, prayers, and blessings. We are here to serve and guide you on your spiritual journey.',
                'content_hi' => 'अपने सवालों, प्रार्थनाओं और आशीर्वादों के साथ हमसे संपर्क करें। हम आपकी आध्यात्मिक यात्रा में आपकी सेवा और मार्गदर्शन के लिए यहाँ हैं।',
                'content_mr' => 'आपल्या प्रश्न, प्रार्थना आणि आशीर्वादांसह आमच्याशी संपर्क साधा. आम्ही आपल्या आध्यात्मिक यात्रेत आपकी सेवा आणि मार्गदर्शन करण्यासाठी येथे आहोत.',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'hero_image'],
            [
                'image_id' => $heroImageMedia->id,
            ]
        );

        // ========== HOW TO REACH SECTION ==========
        // By Road
        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'how_to_reach_road_title'],
            [
                'content_en' => 'By Road',
                'content_hi' => 'सड़क मार्ग से',
                'content_mr' => 'रस्त्याने',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'how_to_reach_road_description'],
            [
                'content_en' => 'Well-connected by highways and state routes. Regular bus services available from nearby towns and cities. Ample parking facilities.',
                'content_hi' => 'राजमार्गों और राज्य मार्गों द्वारा अच्छी तरह से जुड़ा हुआ। पास के शहरों से नियमित बस सेवाएं उपलब्ध। पर्याप्त पार्किंग सुविधाएं।',
                'content_mr' => 'राजमार्ग आणि राज्य मार्गांद्वारे चांगल्या प्रकारे जोडलेले. जवळच्या शहरांमधून नियमित बस सेवा उपलब्ध. पुरेसी पार्किंग सुविधा.',
            ]
        );

        // By Train
        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'how_to_reach_train_title'],
            [
                'content_en' => 'By Train',
                'content_hi' => 'ट्रेन से',
                'content_mr' => 'ट्रेनने',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'how_to_reach_train_description'],
            [
                'content_en' => 'Railway station located nearby with good connectivity. Regular train services to major cities and towns. Local transportation available from station.',
                'content_hi' => 'पास में रेलवे स्टेशन अच्छी कनेक्टिविटी के साथ। प्रमुख शहरों और कस्बों के लिए नियमित ट्रेन सेवाएं। स्टेशन से स्थानीय परिवहन उपलब्ध।',
                'content_mr' => 'जवळ रेलवे स्टेशन चांगल्या कनेक्टिव्हिटीसह. मुख्य शहर आणि कस्बांसाठी नियमित ट्रेन सेवा. स्टेशनमधून स्थानिक वाहतूक उपलब्ध.',
            ]
        );

        // By Air
        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'how_to_reach_air_title'],
            [
                'content_en' => 'By Air',
                'content_hi' => 'विमान से',
                'content_mr' => 'विमानाने',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'contact', 'section_key' => 'how_to_reach_air_description'],
            [
                'content_en' => 'Nearest airport with domestic and international connections. Convenient taxi and car rental services available. Well-established air connectivity.',
                'content_hi' => 'निकटतम हवाई अड्डा घरेलू और अंतर्राष्ट्रीय कनेक्शन के साथ। सुविधाजनक टैक्सी और कार किराए की सेवाएं उपलब्ध। स्थापित वायु कनेक्टिविटी।',
                'content_mr' => 'जवळचे विमानतळ देशांतर्गत आणि आंतरराष्ट्रीय कनेक्शनसह. सुविधाजनक टॅक्सी आणि कार किराये सेवा उपलब्ध. स्थापित हवा कनेक्टिव्हिटी.',
            ]
        );
    }
}
