<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\PageContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PoojaAndDonationPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create media record for pooja & donation page hero image
        $heroImageMedia = Media::updateOrCreate(
            ['filename' => 'pooja_donation-hero.jpg'],
            [
                'original_name' => 'pooja_donation-hero.jpg',
                'file_path' => 'uploads/pooja_donation-hero.jpg',
                'file_url' => '/storage/uploads/pooja_donation-hero.jpg',
                'file_size' => 237 * 1024, // 237KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        // Create separate media record for banner image
        $bannerImageMedia = Media::updateOrCreate(
            ['filename' => 'pooja_donation-banner.jpg'],
            [
                'original_name' => 'pooja_donation-banner.jpg',
                'file_path' => 'uploads/pooja_donation-banner.jpg',
                'file_url' => '/storage/uploads/pooja_donation-banner.jpg',
                'file_size' => 237 * 1024, // 237KB
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
            ]
        );

        // ========== HERO SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'hero_title'],
            [
                'content_en' => 'Pooja & Donation',
                'content_hi' => 'पूजा एवं दान',
                'content_mr' => 'पूजा आणि देणगी',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'hero_subtitle'],
            [
                'content_en' => 'Participate in sacred rituals and support the temple through your generous contributions',
                'content_hi' => 'पवित्र अनुष्ठानों में भाग लें और अपने उदार योगदान से मंदिर का सहयोग करें',
                'content_mr' => 'पवित्र विधींमध्ये सहभागी व्हा आणि आपल्या उदार योगदानाद्वारे मंदिराला सहाय्य करा',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'hero_image'],
            [
                'image_id' => $heroImageMedia->id,
            ]
        );

        // ========== SERVICES SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'services_title'],
            [
                'content_en' => 'Pooja Services',
                'content_hi' => 'पूजा सेवाएँ',
                'content_mr' => 'पूजा सेवा',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'services_subtitle'],
            [
                'content_en' => 'Book a pooja and receive divine blessings from Maa Durga',
                'content_hi' => 'पूजा बुक करें और माँ दुर्गा का दिव्य आशीर्वाद प्राप्त करें',
                'content_mr' => 'पूजा बुक करा आणि माँ दुर्गेचा दिव्य आशीर्वाद प्राप्त करा',
            ]
        );

        // Service 1 - Daily Aarti
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_1_name'],
            [
                'content_en' => 'Daily Aarti',
                'content_hi' => 'दैनिक आरती',
                'content_mr' => 'दैनिक आरती',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_1_time'],
            [
                'content_en' => '6:00 AM & 7:00 PM',
                'content_hi' => 'सुबह 6:00 और शाम 7:00',
                'content_mr' => 'सकाळी ६:०० आणि संध्याकाळी ७:००',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_1_description'],
            [
                'content_en' => 'Morning and evening aarti performed with traditional rituals and devotional hymns.',
                'content_hi' => 'पारंपरिक अनुष्ठानों और भक्ति गीतों के साथ सुबह और शाम की आरती।',
                'content_mr' => 'पारंपारिक विधी आणि भक्तिगीतांसह सकाळ आणि संध्याकाळची आरती.',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_1_amount_type'],
            [
                'content_en' => 'free',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_1_icon'],
            [
                'content_en' => 'flame',
            ]
        );

        // Service 2 - Special Durga Pooja
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_2_name'],
            [
                'content_en' => 'Special Durga Pooja',
                'content_hi' => 'विशेष दुर्गा पूजा',
                'content_mr' => 'विशेष दुर्गा पूजा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_2_time'],
            [
                'content_en' => 'Every Ashtami',
                'content_hi' => 'हर अष्टमी',
                'content_mr' => 'प्रत्येक अष्टमी',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_2_description'],
            [
                'content_en' => 'Elaborate worship ceremony dedicated to Maa Durga with special offerings and mantras.',
                'content_hi' => 'विशेष अर्पण और मंत्रों के साथ माँ दुर्गा को समर्पित विस्तृत पूजा अनुष्ठान।',
                'content_mr' => 'विशेष अर्पण आणि मंत्रांसह माँ दुर्गेला समर्पित विस्तृत पूजा विधी.',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_2_amount_type'],
            [
                'content_en' => 'paid',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_2_amount'],
            [
                'content_en' => '501',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_2_icon'],
            [
                'content_en' => 'star',
            ]
        );

        // Service 3 - Satyanarayan Pooja
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_3_name'],
            [
                'content_en' => 'Satyanarayan Pooja',
                'content_hi' => 'सत्यनारायण पूजा',
                'content_mr' => 'सत्यनारायण पूजा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_3_time'],
            [
                'content_en' => 'Every Purnima',
                'content_hi' => 'हर पूर्णिमा',
                'content_mr' => 'प्रत्येक पौर्णिमा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_3_description'],
            [
                'content_en' => 'Monthly Satyanarayan Katha and pooja for blessings of prosperity and well-being.',
                'content_hi' => 'समृद्धि और कल्याण के आशीर्वाद के लिए मासिक सत्यनारायण कथा और पूजा।',
                'content_mr' => 'समृद्धी आणि कल्याणासाठी मासिक सत्यनारायण कथा आणि पूजा.',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_3_amount_type'],
            [
                'content_en' => 'paid',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_3_amount'],
            [
                'content_en' => '1100',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_3_icon'],
            [
                'content_en' => 'sparkles',
            ]
        );

        // Service 4 - Navratri Special Pooja
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_4_name'],
            [
                'content_en' => 'Navratri Special Pooja',
                'content_hi' => 'नवरात्रि विशेष पूजा',
                'content_mr' => 'नवरात्र विशेष पूजा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_4_time'],
            [
                'content_en' => 'During Navratri',
                'content_hi' => 'नवरात्रि के दौरान',
                'content_mr' => 'नवरात्री दरम्यान',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_4_description'],
            [
                'content_en' => 'Nine-day special worship with Kumkum Archana, Havan, and community celebrations.',
                'content_hi' => 'कुमकुम अर्चना, हवन और सामुदायिक उत्सव के साथ नौ दिन की विशेष पूजा।',
                'content_mr' => 'कुंकुम अर्चना, हवन आणि सामुदायिक उत्सवासह नऊ दिवसांची विशेष पूजा.',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_4_amount_type'],
            [
                'content_en' => 'paid',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_4_amount'],
            [
                'content_en' => '2100',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_4_icon'],
            [
                'content_en' => 'calendar',
            ]
        );

        // Service 5 - Abhishek Pooja
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_5_name'],
            [
                'content_en' => 'Abhishek Pooja',
                'content_hi' => 'अभिषेक पूजा',
                'content_mr' => 'अभिषेक पूजा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_5_time'],
            [
                'content_en' => 'On Request',
                'content_hi' => 'अनुरोध पर',
                'content_mr' => 'विनंतीनुसार',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_5_description'],
            [
                'content_en' => 'Sacred bathing of the deity with milk, honey, curd, and holy water.',
                'content_hi' => 'दूध, शहद, दही और पवित्र जल से देवता का पवित्र स्नान।',
                'content_mr' => 'दूध, मध, दही आणि पवित्र जलाने देवतेचे पवित्र स्नान.',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_5_amount_type'],
            [
                'content_en' => 'paid',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_5_amount'],
            [
                'content_en' => '1100',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_5_icon'],
            [
                'content_en' => 'flame',
            ]
        );

        // Service 6 - Birthday/Anniversary Pooja
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_6_name'],
            [
                'content_en' => 'Birthday/Anniversary Pooja',
                'content_hi' => 'जन्मदिन/वर्षगाँठ पूजा',
                'content_mr' => 'वाढदिवस/वर्धापनदिन पूजा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_6_time'],
            [
                'content_en' => 'On Request',
                'content_hi' => 'अनुरोध पर',
                'content_mr' => 'विनंतीनुसार',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_6_description'],
            [
                'content_en' => 'Personal pooja for family special occasions with Maa Durga\'s blessings.',
                'content_hi' => 'माँ दुर्गा के आशीर्वाद के साथ पारिवारिक विशेष अवसरों के लिए व्यक्तिगत पूजा।',
                'content_mr' => 'माँ दुर्गेच्या आशीर्वादासह कौटुंबिक विशेष प्रसंगांसाठी वैयक्तिक पूजा.',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_6_amount_type'],
            [
                'content_en' => 'paid',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_6_amount'],
            [
                'content_en' => '751',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'service_6_icon'],
            [
                'content_en' => 'star',
            ]
        );

        // ========== SCHEDULE SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_1_time'],
            [
                'content_en' => '6:00 AM',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_1_description'],
            [
                'content_en' => 'Mangal Aarti & Temple Opening',
                'content_hi' => 'मंगल आरती एवं मंदिर खुलना',
                'content_mr' => 'मंगल आरती आणि मंदिर उघडणे',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_2_time'],
            [
                'content_en' => '7:00 AM',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_2_description'],
            [
                'content_en' => 'Abhishek & Morning Pooja',
                'content_hi' => 'अभिषेक एवं प्रातः पूजा',
                'content_mr' => 'अभिषेक आणि सकाळची पूजा',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_3_time'],
            [
                'content_en' => '8:00 AM',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_3_description'],
            [
                'content_en' => 'Shringar & Darshan',
                'content_hi' => 'श्रृंगार एवं दर्शन',
                'content_mr' => 'शृंगार आणि दर्शन',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_4_time'],
            [
                'content_en' => '12:00 PM',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_4_description'],
            [
                'content_en' => 'Madhyanha Aarti & Bhog',
                'content_hi' => 'मध्याह्न आरती एवं भोग',
                'content_mr' => 'मध्यान्ह आरती आणि भोग',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_5_time'],
            [
                'content_en' => '5:00 PM',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_5_description'],
            [
                'content_en' => 'Evening Darshan Opens',
                'content_hi' => 'संध्या दर्शन आरंभ',
                'content_mr' => 'संध्याकाळचे दर्शन सुरू',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_6_time'],
            [
                'content_en' => '7:00 PM',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_6_description'],
            [
                'content_en' => 'Sandhya Aarti',
                'content_hi' => 'संध्या आरती',
                'content_mr' => 'संध्या आरती',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_7_time'],
            [
                'content_en' => '9:00 PM',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'schedule_7_description'],
            [
                'content_en' => 'Shayan Aarti & Temple Closing',
                'content_hi' => 'शयन आरती एवं मंदिर बंद',
                'content_mr' => 'शयन आरती आणि मंदिर बंद',
            ]
        );

        // ========== DONATIONS SECTION ==========
        // Donation 1 - Anna Daan
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_1_name'],
            [
                'content_en' => 'Anna Daan',
                'content_hi' => 'अन्न दान',
                'content_mr' => 'अन्न दान',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_1_description'],
            [
                'content_en' => 'Support feeding the poor and needy devotees at the temple',
                'content_hi' => 'मंदिर में गरीब और जरूरतमंद भक्तों को भोजन कराने में सहायता करें',
                'content_mr' => 'मंदिरात गरीब आणि असहाय्य भक्तांना अन्न देण्यासाठी समर्थन करा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_1_suggested_amount'],
            [
                'content_en' => '1,100',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_1_icon'],
            [
                'content_en' => 'gift',
            ]
        );

        // Donation 2 - Diya Fund
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_2_name'],
            [
                'content_en' => 'Diya Fund',
                'content_hi' => 'दीया फंड',
                'content_mr' => 'दिवा निधी',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_2_description'],
            [
                'content_en' => 'Help light the sacred lamps during festivals and daily worship',
                'content_hi' => 'त्योहारों और दैनिक पूजा के दौरान पवित्र दीये जलाने में मदद करें',
                'content_mr' => 'उत्सव आणि दैनिक पूजेच्या वेळी पवित्र दिवे लावण्यास मदत करा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_2_suggested_amount'],
            [
                'content_en' => '251',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_2_icon'],
            [
                'content_en' => 'flame',
            ]
        );

        // Donation 3 - Maintenance Fund
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_3_name'],
            [
                'content_en' => 'Maintenance Fund',
                'content_hi' => 'रखरखाव निधि',
                'content_mr' => 'देखभाल निधी',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_3_description'],
            [
                'content_en' => 'Support the upkeep and renovation of our sacred temple',
                'content_hi' => 'हमारे पवित्र मंदिर के रखरखाव और नवीनीकरण में सहायता करें',
                'content_mr' => 'आमच्या पवित्र मंदिराची देखभाल आणि पुनर्निर्मितीमध्ये समर्थन करा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_3_suggested_amount'],
            [
                'content_en' => '5,001',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_3_icon'],
            [
                'content_en' => 'heart',
            ]
        );

        // Donation 4 - Festival Fund
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_4_name'],
            [
                'content_en' => 'Festival Fund',
                'content_hi' => 'त्योहार निधि',
                'content_mr' => 'उत्सव निधी',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_4_description'],
            [
                'content_en' => 'Help organize grand celebrations and community events throughout the year',
                'content_hi' => 'पूरे वर्ष भर भव्य समारोह और सामुदायिक आयोजनों को व्यवस्थित करने में मदद करें',
                'content_mr' => 'वर्षभर मोठे सोहळे आणि सामुदायिक कार्यक्रम आयोजित करण्यासाठी मदत करा',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_4_suggested_amount'],
            [
                'content_en' => '2,501',
            ]
        );
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'donation_4_icon'],
            [
                'content_en' => 'sparkles',
            ]
        );

        // ========== BANNER SECTION ==========
        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'banner_quote'],
            [
                'content_en' => '"The grace of Maa Durga protects all those who seek her blessings with a pure heart and devoted soul."',
                'content_hi' => '"माँ दुर्गा की कृपा उन सभी की रक्षा करती है जो शुद्ध हृदय और समर्पित आत्मा से उनका आशीर्वाद चाहते हैं।"',
                'content_mr' => '"माँ दुर्गेचा अनुग्रह त्यांच्या सर्व भक्तांचे रक्षण करतो जे शुद्ध हृदय आणि समर्पित आत्मेने तिचा आशीर्वाद शोधतात।"',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'pooja_donation', 'section_key' => 'banner_image'],
            [
                'image_id' => $bannerImageMedia->id,
            ]
        );
    }
}
