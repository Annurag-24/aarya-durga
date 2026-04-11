<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class AboutUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hero Main Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'hero_main_title'],
            [
                'content_en' => 'About Aarya Durga Temple',
                'content_hi' => 'आर्य दुर्गा मंदिर के बारे में',
                'content_mr' => 'आर्या दुर्गा मंदिराबद्दल',
            ]
        );

        // Hero Main Subtitle (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'hero_main_subtitle'],
            [
                'content_en' => 'Aarya Durga Temple stands as a beacon of spiritual enlightenment and cultural heritage. Built with devotion and maintained with reverence, this sacred space welcomes devotees from all walks of life.',
                'content_hi' => 'आर्य दुर्गा मंदिर आध्यात्मिक ज्ञान और सांस्कृतिक विरासत का एक प्रकाशस्तंभ है। भक्ति से निर्मित और श्रद्धा से संजोया गया यह पवित्र स्थान सभी भक्तों का स्वागत करता है।',
                'content_mr' => 'आर्या दुर्गा मंदिर आध्यात्मिक प्रकाश आणि सांस्कृतिक वारशाचे प्रतीक आहे. भक्तीभावाने उभारलेले आणि श्रद्धेने जपलेले हे पवित्र स्थान सर्व भक्तांचे स्वागत करते.',
            ]
        );

        // Mission Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'mission_title'],
            [
                'content_en' => 'Our Mission & Vision',
                'content_hi' => 'हमारा मिशन और दृष्टि',
                'content_mr' => 'आमचे मिशन आणि दृष्टिकोन',
            ]
        );

        // Mission Description (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'mission_description'],
            [
                'content_en' => 'To preserve and promote the spiritual heritage of Aarya Durga Devi, fostering a community rooted in devotion, cultural values, and service to humanity. We envision a temple that continues to be a guiding light for future generations, keeping alive the rich traditions of the Konkan region.',
                'content_hi' => 'आर्य दुर्गा देवी की आध्यात्मिक विरासत को संरक्षित और प्रचारित करना, भक्ति, सांस्कृतिक मूल्यों और मानवता की सेवा में निहित एक समुदाय का पोषण करना। हम एक ऐसे मंदिर की कल्पना करते हैं जो भविष्य की पीढ़ियों के लिए मार्गदर्शक प्रकाश बना रहे, कोंकण क्षेत्र की समृद्ध परंपराओं को जीवंत रखे।',
                'content_mr' => 'आर्य दुर्गा देवीची आध्यात्मिक वारस संरक्षित आणि प्रचारित करणे, भक्ती, सांस्कृतिक मूल्यांच्या आणि मानवतेच्या सेवेत निहित समुदाय वाढणे। आम्ही असल्या मंदिराची कल्पना करतो जो भविष्यातील पिढ्यांसाठी मार्गदर्शक प्रकाश राहील, कोंकण क्षेत्राची समृद्ध परंपरा जीवंत ठेवील।',
            ]
        );

        // Core Values Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'values_title'],
            [
                'content_en' => 'Our Core Values',
                'content_hi' => 'हमारे मूल मूल्य',
                'content_mr' => 'आमचे मूलभूत मूल्य',
            ]
        );

        // Devotion Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'devotion_title'],
            [
                'content_en' => 'Devotion',
                'content_hi' => 'भक्ति',
                'content_mr' => 'भक्ती',
            ]
        );

        // Devotion Description (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'devotion_description'],
            [
                'content_en' => 'Deep spiritual connection with Maa Durga through daily prayers and rituals.',
                'content_hi' => 'दैनिक प्रार्थना और अनुष्ठानों के माध्यम से माँ दुर्गा के साथ गहरा आध्यात्मिक संबंध।',
                'content_mr' => 'दैनिक प्रार्थना आणि संस्कारांद्वारे माता दुर्गाशी गहरा आध्यात्मिक संबंध.',
            ]
        );

        // Community Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'community_title'],
            [
                'content_en' => 'Community',
                'content_hi' => 'समुदाय',
                'content_mr' => 'समुदाय',
            ]
        );

        // Community Description (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'community_description'],
            [
                'content_en' => 'Bringing together devotees from all walks of life in unity and harmony.',
                'content_hi' => 'जीवन के सभी क्षेत्रों से भक्तों को एकता और सद्भावना में एक साथ लाना।',
                'content_mr' => 'जीवनाच्या सर्व क्षेत्रातून भक्तांना एकता आणि सद्भावनेत एकत्र आणणे.',
            ]
        );

        // Tradition Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'tradition_title'],
            [
                'content_en' => 'Tradition',
                'content_hi' => 'परंपरा',
                'content_mr' => 'परंपरा',
            ]
        );

        // Tradition Description (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'tradition_description'],
            [
                'content_en' => 'Preserving centuries-old Konkan rituals and cultural heritage.',
                'content_hi' => 'सदियों पुरानी कोंकण परंपराओं और सांस्कृतिक विरासत को संरक्षित करना।',
                'content_mr' => 'शतकांपासूनची कोंकण परंपरा आणि सांस्कृतिक वारस संरक्षित करणे.',
            ]
        );

        // Service Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'service_title'],
            [
                'content_en' => 'Service',
                'content_hi' => 'सेवा',
                'content_mr' => 'सेवा',
            ]
        );

        // Service Description (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'service_description'],
            [
                'content_en' => 'Serving the community through charitable activities and spiritual guidance.',
                'content_hi' => 'दाता गतिविधियों और आध्यात्मिक मार्गदर्शन के माध्यम से समुदाय की सेवा करना।',
                'content_mr' => 'धर्मार्थ क्रियाकलाप आणि आध्यात्मिक मार्गदर्शनाद्वारे समुदायाची सेवा करणे.',
            ]
        );

        // Committee Title (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'committee_title'],
            [
                'content_en' => 'Temple Trust & Committee',
                'content_hi' => 'मंदिर ट्रस्ट और समिति',
                'content_mr' => 'मंदिर ट्रस्ट व समिती',
            ]
        );

        // Committee Description (TRANSLATABLE)
        PageContent::updateOrCreate(
            ['page_key' => 'about', 'section_key' => 'committee_description'],
            [
                'content_en' => 'The temple is managed by a dedicated committee of trustees and volunteers who ensure the smooth operation of daily rituals, festivals, and community services.',
                'content_hi' => 'मंदिर का प्रबंधन समर्पित ट्रस्टियों और स्वयंसेवकों की एक समिति द्वारा किया जाता है जो दैनिक अनुष्ठानों, त्योहारों और सामुदायिक सेवाओं के सुचारू संचालन को सुनिश्चित करते हैं।',
                'content_mr' => 'मंदिराचे व्यवस्थापन समर्पित ट्रस्टी आणि स्वेच्छासेवकांच्या समितीद्वारे केले जाते जे दैनिक संस्कार, उत्सव आणि सामुदायिक सेवांचे सुरळीत संचालन सुनिश्चित करतात.',
            ]
        );

    }
}
