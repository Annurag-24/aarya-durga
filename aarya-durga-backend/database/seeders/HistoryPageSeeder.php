<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\PageContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HistoryPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create media records for history page images
        $heroImageMedia = Media::updateOrCreate(
            ['filename' => 'history-hero.jpg'],
            [
                'original_name' => 'history-hero.jpg',
                'file_path' => 'uploads/history-hero.jpg',
                'file_url' => '/storage/uploads/history-hero.jpg',
                'file_size' => 237 * 1024, // 237KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        $originImageMedia = Media::updateOrCreate(
            ['filename' => 'history-origin.jpg'],
            [
                'original_name' => 'history-origin.jpg',
                'file_path' => 'uploads/history-origin.jpg',
                'file_url' => '/storage/uploads/history-origin.jpg',
                'file_size' => 118 * 1024, // 118KB
                'mime_type' => 'image/jpeg',
                'width' => 800,
                'height' => 800,
            ]
        );

        // ========== HERO SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'hero_title'],
            [
                'content_en' => 'History of Aarya Durga Devi',
                'content_hi' => 'आर्या दुर्गा देवी का इतिहास',
                'content_mr' => 'आर्या दुर्गा देवीचा इतिहास',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'hero_subtitle'],
            [
                'content_en' => 'A journey through centuries of devotion, tradition, and divine grace',
                'content_hi' => 'भक्ति, परंपरा और दिव्य कृपा की सदियों की यात्रा',
                'content_mr' => 'भक्ती, परंपरा आणि दिव्य कृपेच्या शतकांचा प्रवास',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'hero_image'],
            [
                'image_id' => $heroImageMedia->id,
            ]
        );

        // ========== ORIGIN SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'origin_title'],
            [
                'content_en' => 'The Divine Origin',
                'content_hi' => 'दिव्य उत्पत्ति',
                'content_mr' => 'दिव्य उत्पत्ती',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'origin_paragraph1'],
            [
                'content_en' => 'The ancient temple of Aarya Durga Devi has stood as a symbol of faith and devotion for the people of Wagde and the surrounding Konkan villages. Legend speaks of a divine manifestation of Goddess Durga at this very spot, where the earth itself is believed to be sanctified by her presence.',
                'content_hi' => 'आर्या दुर्गा देवी का प्राचीन मंदिर वागडे और आसपास के कोंकण गाँवों के लोगों के लिए श्रद्धा और भक्ति का प्रतीक रहा है। इस स्थान पर देवी दुर्गा के दिव्य प्रकटीकरण की कथा कही जाती है।',
                'content_mr' => 'आर्या दुर्गा देवीचे प्राचीन मंदिर वागडे आणि आसपासच्या कोकण गावांच्या लोकांसाठी श्रद्धा आणि भक्तीचे प्रतीक म्हणून उभे आहे. या ठिकाणी देवी दुर्गेच्या दिव्य प्रकटीकरणाची कथा सांगितली जाते.',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'origin_paragraph2'],
            [
                'content_en' => 'Worshipped by generations, the deity continues to inspire strength, unity, and unwavering faith among all who seek her blessings. The temple\'s history is intertwined with the cultural fabric of the Konkan region.',
                'content_hi' => 'पीढ़ियों से पूजी जा रही देवता शक्ति, एकता और अटल विश्वास को प्रेरित करती रहती हैं।',
                'content_mr' => 'पिढ्यानपिढ्या पूजलेली देवता शक्ती, एकता आणि अढळ श्रद्धा प्रेरित करत राहते.',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'origin_image'],
            [
                'image_id' => $originImageMedia->id,
            ]
        );

        // ========== TIMELINE SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'timeline_title'],
            [
                'content_en' => 'Through the Ages',
                'content_hi' => 'युगों के माध्यम से',
                'content_mr' => 'काळाच्या ओघात',
            ]
        );

        // Ancient Era
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'ancient_era'],
            [
                'content_en' => 'Ancient Era',
                'content_hi' => 'प्राचीन काल',
                'content_mr' => 'प्राचीन काळ',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'ancient_title'],
            [
                'content_en' => 'Temple Establishment',
                'content_hi' => 'मंदिर स्थापना',
                'content_mr' => 'मंदिर स्थापना',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'ancient_description'],
            [
                'content_en' => 'The sacred site was first consecrated by the ancestors of the Konkan region, marking the beginning of centuries of devotion to Goddess Durga.',
                'content_hi' => 'कोंकण क्षेत्र के पूर्वजों ने इस पवित्र स्थल को सबसे पहले अभिषिक्त किया।',
                'content_mr' => 'कोकण प्रदेशातील पूर्वजांनी हे पवित्र स्थळ प्रथम अभिषिक्त केले.',
            ]
        );

        // Medieval Period
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'medieval_era'],
            [
                'content_en' => 'Medieval Period',
                'content_hi' => 'मध्यकाल',
                'content_mr' => 'मध्ययुगीन काळ',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'medieval_title'],
            [
                'content_en' => 'Royal Patronage',
                'content_hi' => 'राज संरक्षण',
                'content_mr' => 'राजाश्रय',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'medieval_description'],
            [
                'content_en' => 'Local rulers and chieftains supported the temple, contributing to its architectural grandeur and expanding its spiritual influence across the region.',
                'content_hi' => 'स्थानीय शासकों ने मंदिर को सहारा दिया, इसकी वास्तुशिल्प भव्यता में योगदान दिया।',
                'content_mr' => 'स्थानिक शासकांनी मंदिराला आधार दिला, त्याच्या वास्तुशिल्पाच्या भव्यतेत भर घातली.',
            ]
        );

        // Colonial Era
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'colonial_era'],
            [
                'content_en' => 'Colonial Era',
                'content_hi' => 'औपनिवेशिक काल',
                'content_mr' => 'वसाहतकालीन काळ',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'colonial_title'],
            [
                'content_en' => 'Preserving Traditions',
                'content_hi' => 'परंपराओं की रक्षा',
                'content_mr' => 'परंपरा जपणे',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'colonial_description'],
            [
                'content_en' => 'Despite challenging times, the devoted community kept the flame of worship alive, passing down sacred rituals from generation to generation.',
                'content_hi' => 'कठिन समय में भी भक्त समुदाय ने पूजा की ज्योति को जीवित रखा।',
                'content_mr' => 'कठीण काळातही भक्त समुदायाने पूजेची ज्योत जिवंत ठेवली.',
            ]
        );

        // Post-Independence
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'post_independence_era'],
            [
                'content_en' => 'Post-Independence',
                'content_hi' => 'स्वतंत्रता के बाद',
                'content_mr' => 'स्वातंत्र्योत्तर',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'post_independence_title'],
            [
                'content_en' => 'Temple Renovation',
                'content_hi' => 'मंदिर जीर्णोद्धार',
                'content_mr' => 'मंदिर जीर्णोद्धार',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'post_independence_description'],
            [
                'content_en' => 'Major renovation work restored the temple to its former glory, with the community coming together to rebuild and beautify the sacred space.',
                'content_hi' => 'प्रमुख जीर्णोद्धार कार्य ने मंदिर को पूर्व गौरव प्रदान किया।',
                'content_mr' => 'प्रमुख जीर्णोद्धार कार्याने मंदिराला पूर्वीचे वैभव पुन्हा प्राप्त करून दिले.',
            ]
        );

        // Modern Day
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'modern_day_era'],
            [
                'content_en' => 'Modern Day',
                'content_hi' => 'आधुनिक काल',
                'content_mr' => 'आधुनिक काळ',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'modern_day_title'],
            [
                'content_en' => 'Community Hub',
                'content_hi' => 'सामुदायिक केंद्र',
                'content_mr' => 'सामुदायिक केंद्र',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'modern_day_description'],
            [
                'content_en' => 'Today, the temple serves as both a spiritual sanctuary and a cultural center, hosting festivals, educational programs, and community gatherings.',
                'content_hi' => 'आज मंदिर एक आध्यात्मिक आश्रय और सांस्कृतिक केंद्र दोनों के रूप में कार्य करता है।',
                'content_mr' => 'आज मंदिर एक आध्यात्मिक आश्रयस्थान आणि सांस्कृतिक केंद्र म्हणून कार्य करते.',
            ]
        );

        // ========== SACRED TRADITIONS SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'traditions_title'],
            [
                'content_en' => 'Sacred Traditions',
                'content_hi' => 'पवित्र परंपराएँ',
                'content_mr' => 'पवित्र परंपरा',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'traditions_subtitle'],
            [
                'content_en' => 'The living traditions that make Aarya Durga Temple unique',
                'content_hi' => 'जीवित परंपराएँ जो आर्या दुर्गा मंदिर को अद्वितीय बनाती हैं',
                'content_mr' => 'आर्या दुर्गा मंदिराला अद्वितीय बनवणाऱ्या जिवंत परंपरा',
            ]
        );

        // Navratri
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'navratri_title'],
            [
                'content_en' => 'Navratri Celebrations',
                'content_hi' => 'नवरात्रि उत्सव',
                'content_mr' => 'नवरात्र उत्सव',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'navratri_description'],
            [
                'content_en' => 'Nine nights of grand devotion featuring garba, dandiya, elaborate aartis, and community feasts that draw thousands of devotees.',
                'content_hi' => 'गरबा, दांडिया, विस्तृत आरती और सामुदायिक भोज के साथ भव्य भक्ति की नौ रातें।',
                'content_mr' => 'गरबा, दांडिया, विस्तृत आरती आणि सामुदायिक भोजनासह भव्य भक्तीच्या नऊ रात्री.',
            ]
        );

        // Sacred Texts
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'texts_title'],
            [
                'content_en' => 'Sacred Texts & Recitations',
                'content_hi' => 'पवित्र ग्रंथ एवं पाठ',
                'content_mr' => 'पवित्र ग्रंथ आणि पाठ',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'texts_description'],
            [
                'content_en' => 'Regular recitation of Durga Saptashati and other sacred scriptures, keeping the literary traditions alive.',
                'content_hi' => 'दुर्गा सप्तशती और अन्य पवित्र ग्रंथों का नियमित पाठ।',
                'content_mr' => 'दुर्गा सप्तशती आणि इतर पवित्र ग्रंथांचे नियमित पठण.',
            ]
        );

        // Konkan Heritage
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'konkan_title'],
            [
                'content_en' => 'Konkan Cultural Heritage',
                'content_hi' => 'कोंकण सांस्कृतिक विरासत',
                'content_mr' => 'कोकणी सांस्कृतिक वारसा',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'konkan_description'],
            [
                'content_en' => 'Unique Konkan-style worship practices that blend local traditions with Vedic rituals.',
                'content_hi' => 'स्थानीय परंपराओं और वैदिक अनुष्ठानों का मिश्रण करने वाली अनूठी कोंकणी पूजा पद्धतियाँ।',
                'content_mr' => 'स्थानिक परंपरा आणि वैदिक विधी यांचे मिश्रण असलेल्या अनोख्या कोकणी पूजा पद्धती.',
            ]
        );

        // Diwali
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'diwali_title'],
            [
                'content_en' => 'Festival of Lights',
                'content_hi' => 'दीपोत्सव',
                'content_mr' => 'दीपोत्सव',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'diwali_description'],
            [
                'content_en' => 'Spectacular Diwali celebrations where the entire temple complex is illuminated with thousands of diyas.',
                'content_hi' => 'हज़ारों दीपों से संपूर्ण मंदिर परिसर जगमगा उठता है।',
                'content_mr' => 'हजारो दिव्यांनी संपूर्ण मंदिर परिसर उजळून निघतो अशा भव्य दिवाळी उत्सव.',
            ]
        );

        // ========== BANNER QUOTE ==========
        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'banner_quote'],
            [
                'content_en' => 'The roots of devotion planted by our ancestors continue to bear the fruits of faith today.',
                'content_hi' => 'हमारे पूर्वजों द्वारा बोई गई भक्ति की जड़ें आज विश्वास के फल दे रही हैं।',
                'content_mr' => 'आमच्या पूर्वजांनी लावलेल्या भक्तीच्या मुळा आज श्रद्धेची फळे देत आहेत।',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'history', 'section_key' => 'banner_image'],
            [
                'image_id' => $heroImageMedia->id,
            ]
        );
    }
}
