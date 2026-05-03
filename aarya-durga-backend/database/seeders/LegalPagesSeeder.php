<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\PageContent;
use Illuminate\Database\Seeder;

class LegalPagesSeeder extends Seeder
{
    public function run(): void
    {
        // Reuse the existing about hero asset as the default background for both legal pages.
        $defaultHeroMedia = Media::firstOrCreate(
            ['filename' => 'home-about.jpg'],
            [
                'original_name' => 'home-about.jpg',
                'file_path' => 'uploads/home-about.jpg',
                'file_url' => '/storage/uploads/home-about.jpg',
                'file_size' => 120 * 1024,
                'mime_type' => 'image/jpeg',
                'width' => 800,
                'height' => 800,
            ]
        );

        // ----- Privacy Policy -----
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'privacy_policy_title'],
            [
                'content_en' => 'Privacy Policy',
                'content_hi' => 'गोपनीयता नीति',
                'content_mr' => 'गोपनीयता धोरण',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'privacy_policy_image'],
            [
                'image_id' => $defaultHeroMedia->id,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'privacy_policy_subtitle'],
            [
                'content_en' => 'How we collect, use, and protect your information at Aarya Durga Temple.',
                'content_hi' => 'आर्य दुर्गा मंदिर में हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।',
                'content_mr' => 'आर्य दुर्गा मंदिरात आम्ही आपली माहिती कशी गोळा, वापर आणि संरक्षित करतो.',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'privacy_policy_content'],
            [
                'content_en' => '<h2>Introduction</h2><p>At Aarya Durga Temple, we respect your privacy and are committed to protecting any personal information you share with us. This Privacy Policy explains what information we collect, how we use it, and the choices available to you.</p><h2>Information We Collect</h2><ul><li>Contact details (name, email, phone) submitted via our contact or donation forms.</li><li>Payment information processed securely by our payment partners.</li><li>Anonymous usage data collected through cookies to improve the website experience.</li></ul><h2>How We Use Your Information</h2><p>Your information is used solely to respond to enquiries, process pooja or donation requests, and share temple updates. We do not sell or rent your personal data to any third party.</p><h2>Data Security</h2><p>We follow industry-standard practices to safeguard your information. Sensitive transactions are handled over secure, encrypted connections.</p><h2>Contact Us</h2><p>For any questions about this Privacy Policy, please reach out to us through the Contact page.</p>',
                'content_hi' => '<h2>परिचय</h2><p>आर्य दुर्गा मंदिर आपकी गोपनीयता का सम्मान करता है और आपके द्वारा साझा की गई किसी भी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि हम कौन सी जानकारी एकत्र करते हैं, उसका उपयोग कैसे करते हैं और आपके पास कौन-से विकल्प उपलब्ध हैं।</p><h2>हम कौन सी जानकारी एकत्र करते हैं</h2><ul><li>संपर्क या दान फॉर्म के माध्यम से भेजे गए नाम, ईमेल और फ़ोन जैसे विवरण।</li><li>हमारे भुगतान भागीदारों द्वारा सुरक्षित रूप से संसाधित भुगतान जानकारी।</li><li>वेबसाइट अनुभव बेहतर बनाने के लिए कुकीज़ के माध्यम से एकत्र किया गया अनाम उपयोग डेटा।</li></ul><h2>हम आपकी जानकारी का उपयोग कैसे करते हैं</h2><p>आपकी जानकारी का उपयोग केवल पूछताछ का उत्तर देने, पूजा या दान अनुरोधों को संसाधित करने और मंदिर के अपडेट साझा करने के लिए किया जाता है। हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष को नहीं बेचते।</p><h2>डेटा सुरक्षा</h2><p>हम आपकी जानकारी की रक्षा के लिए उद्योग मानक प्रथाओं का पालन करते हैं। संवेदनशील लेनदेन सुरक्षित, एन्क्रिप्टेड कनेक्शन पर संभाले जाते हैं।</p><h2>हमसे संपर्क करें</h2><p>इस गोपनीयता नीति के बारे में किसी भी प्रश्न के लिए, कृपया हमारे संपर्क पृष्ठ के माध्यम से हमसे संपर्क करें।</p>',
                'content_mr' => '<h2>प्रस्तावना</h2><p>आर्य दुर्गा मंदिर आपल्या गोपनीयतेचा आदर करते आणि आपण आमच्याशी सामायिक केलेल्या कोणत्याही वैयक्तिक माहितीचे संरक्षण करण्यासाठी कटिबद्ध आहे. हे गोपनीयता धोरण आम्ही कोणती माहिती गोळा करतो, तिचा वापर कसा करतो आणि आपल्यासाठी कोणते पर्याय उपलब्ध आहेत हे स्पष्ट करते.</p><h2>आम्ही कोणती माहिती गोळा करतो</h2><ul><li>संपर्क किंवा देणगी फॉर्मद्वारे पाठवलेले नाव, ईमेल आणि फोन यासारखे तपशील.</li><li>आमच्या पेमेंट भागीदारांद्वारे सुरक्षितपणे प्रक्रिया केलेली पेमेंट माहिती.</li><li>वेबसाइट अनुभव सुधारण्यासाठी कुकीजद्वारे गोळा केलेला अनामिक वापर डेटा.</li></ul><h2>आम्ही आपली माहिती कशी वापरतो</h2><p>आपली माहिती केवळ चौकशींना उत्तर देण्यासाठी, पूजा किंवा देणगी विनंत्यांवर प्रक्रिया करण्यासाठी आणि मंदिराच्या अद्यतनांची माहिती सामायिक करण्यासाठी वापरली जाते. आम्ही आपली वैयक्तिक माहिती कोणत्याही तृतीय पक्षाला विकत नाही.</p><h2>डेटा सुरक्षा</h2><p>आम्ही आपल्या माहितीचे संरक्षण करण्यासाठी उद्योग-मानक पद्धतींचे पालन करतो. संवेदनशील व्यवहार सुरक्षित, एनक्रिप्टेड कनेक्शनवर हाताळले जातात.</p><h2>आमच्याशी संपर्क साधा</h2><p>या गोपनीयता धोरणाबद्दल कोणत्याही प्रश्नांसाठी, कृपया आमच्या संपर्क पृष्ठाद्वारे आमच्याशी संपर्क साधा.</p>',
            ]
        );

        // ----- Terms & Conditions -----
        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'terms_conditions_title'],
            [
                'content_en' => 'Terms & Conditions',
                'content_hi' => 'नियम एवं शर्तें',
                'content_mr' => 'नियम आणि अटी',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'terms_conditions_image'],
            [
                'image_id' => $defaultHeroMedia->id,
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'terms_conditions_subtitle'],
            [
                'content_en' => 'The rules and guidelines that govern your use of the Aarya Durga Temple website.',
                'content_hi' => 'आर्य दुर्गा मंदिर की वेबसाइट के उपयोग को नियंत्रित करने वाले नियम और दिशानिर्देश।',
                'content_mr' => 'आर्य दुर्गा मंदिराच्या वेबसाइटच्या वापरास नियंत्रित करणारे नियम आणि मार्गदर्शक तत्त्वे.',
            ]
        );

        PageContent::updateOrCreate(
            ['page_key' => 'home', 'section_key' => 'terms_conditions_content'],
            [
                'content_en' => '<h2>Acceptance of Terms</h2><p>By accessing the Aarya Durga Temple website, you agree to abide by these Terms & Conditions. If you do not agree, please discontinue use of the site.</p><h2>Use of the Website</h2><ul><li>The content on this site is provided for general information about the temple and its services.</li><li>You agree not to misuse the website, attempt to disrupt its operation, or use it for unlawful purposes.</li></ul><h2>Donations & Pooja Bookings</h2><p>All donations and pooja bookings made through the website are voluntary and non-refundable, except where required by applicable law. Confirmation of bookings is subject to availability and temple guidelines.</p><h2>Intellectual Property</h2><p>All text, images, logos, and other content on this site are the property of Aarya Durga Temple unless stated otherwise, and may not be reproduced without permission.</p><h2>Changes to These Terms</h2><p>We may update these Terms & Conditions from time to time. The updated version will be posted on this page with a revised effective date.</p>',
                'content_hi' => '<h2>शर्तों की स्वीकृति</h2><p>आर्य दुर्गा मंदिर की वेबसाइट तक पहुँच कर, आप इन नियम एवं शर्तों का पालन करने के लिए सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया इस साइट का उपयोग बंद करें।</p><h2>वेबसाइट का उपयोग</h2><ul><li>इस साइट पर सामग्री मंदिर और उसकी सेवाओं के बारे में सामान्य जानकारी के लिए प्रदान की गई है।</li><li>आप वेबसाइट का दुरुपयोग न करने, उसके संचालन को बाधित करने या उसका अवैध उद्देश्यों के लिए उपयोग न करने पर सहमत हैं।</li></ul><h2>दान और पूजा बुकिंग</h2><p>वेबसाइट के माध्यम से किए गए सभी दान और पूजा बुकिंग स्वैच्छिक और गैर-वापसी योग्य हैं, सिवाय इसके कि लागू कानून द्वारा आवश्यक हो। बुकिंग की पुष्टि उपलब्धता और मंदिर के दिशानिर्देशों के अधीन है।</p><h2>बौद्धिक संपदा</h2><p>इस साइट पर सभी पाठ, चित्र, लोगो और अन्य सामग्री अन्यथा कहे जाने तक आर्य दुर्गा मंदिर की संपत्ति हैं और बिना अनुमति के पुनः उत्पादन नहीं की जा सकती।</p><h2>इन शर्तों में परिवर्तन</h2><p>हम समय-समय पर इन नियम एवं शर्तों को अपडेट कर सकते हैं। अपडेट किया गया संस्करण इस पृष्ठ पर संशोधित प्रभावी तिथि के साथ पोस्ट किया जाएगा।</p>',
                'content_mr' => '<h2>अटींची स्वीकृती</h2><p>आर्य दुर्गा मंदिराच्या वेबसाइटमध्ये प्रवेश करून, आपण या नियम आणि अटींचे पालन करण्यास सहमती देता. आपण सहमत नसल्यास, कृपया साइटचा वापर बंद करा.</p><h2>वेबसाइटचा वापर</h2><ul><li>या साइटवरील सामग्री मंदिर आणि त्याच्या सेवांविषयी सामान्य माहितीसाठी पुरवली आहे.</li><li>आपण वेबसाइटचा गैरवापर न करण्यास, तिच्या कार्यात अडथळा आणण्याचा प्रयत्न न करण्यास किंवा बेकायदेशीर हेतूंसाठी वापर न करण्यास सहमती देता.</li></ul><h2>देणग्या आणि पूजा नोंदणी</h2><p>वेबसाइटद्वारे केलेल्या सर्व देणग्या आणि पूजा नोंदणी ऐच्छिक आणि नॉन-रिफंडेबल आहेत, लागू कायद्यानुसार आवश्यक असलेल्या प्रकरणांशिवाय. नोंदणीची पुष्टी उपलब्धता आणि मंदिराच्या मार्गदर्शक तत्त्वांच्या अधीन आहे.</p><h2>बौद्धिक संपदा</h2><p>या साइटवरील सर्व मजकूर, प्रतिमा, लोगो आणि इतर सामग्री अन्यथा सांगितलेले नसल्यास आर्य दुर्गा मंदिराची मालमत्ता आहेत आणि परवानगीशिवाय पुनरुत्पादन केले जाऊ शकत नाहीत.</p><h2>या अटींमध्ये बदल</h2><p>आम्ही वेळोवेळी या नियम आणि अटी अद्यतनित करू शकतो. सुधारित प्रभावी तारखेसह अद्यतनित आवृत्ती या पृष्ठावर प्रकाशित केली जाईल.</p>',
            ]
        );
    }
}
