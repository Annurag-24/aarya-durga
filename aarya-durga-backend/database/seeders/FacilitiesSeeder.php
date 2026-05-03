<?php

namespace Database\Seeders;

use App\Models\Facility;
use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FacilitiesSeeder extends Seeder
{
    public function run(): void
    {
        $facilities = [
            [
                'filename' => 'facility-parking.jpg',
                'title_en' => 'Devotee Parking',
                'title_mr' => 'भक्त वाहनतळ',
                'description_en' => '<p>Spacious and secure parking is available for all devotees and visitors arriving by car, two-wheeler or bus. The parking area is conveniently located close to the main temple entrance, with separate sections for two-wheelers and four-wheelers.</p><p>Volunteers are present during peak hours and festival days to guide vehicles, ensure orderly arrangement, and assist senior citizens and differently-abled devotees in reaching the temple comfortably.</p>',
                'description_mr' => '<p>कार, दुचाकी किंवा बसने येणाऱ्या सर्व भक्तांसाठी आणि अभ्यागतांसाठी प्रशस्त आणि सुरक्षित वाहनतळ उपलब्ध आहे. मुख्य मंदिर प्रवेशद्वाराजवळ सोयीस्करपणे स्थित असलेल्या या वाहनतळामध्ये दुचाकी आणि चारचाकी वाहनांसाठी स्वतंत्र विभाग आहेत.</p><p>गर्दीच्या वेळी आणि उत्सवाच्या दिवशी वाहनांना मार्गदर्शन करण्यासाठी, सुव्यवस्थित मांडणी सुनिश्चित करण्यासाठी आणि ज्येष्ठ नागरिक व दिव्यांग भक्तांना मंदिरापर्यंत आरामात पोहोचण्यास मदत करण्यासाठी स्वयंसेवक उपस्थित असतात.</p>',
            ],
            [
                'filename' => 'facility-prasad-hall.jpg',
                'title_en' => 'Prasad Hall',
                'title_mr' => 'प्रसाद सभागृह',
                'description_en' => '<p>The temple prasad hall serves freshly prepared mahaprasad to all devotees throughout the day. Meals are cooked in a clean, dedicated kitchen using traditional recipes, and are offered with the same devotion that has been part of the temple for generations.</p><p>The hall can comfortably seat hundreds of devotees at a time and is open during all major festivals, weekly poojas and special occasions. Drinking water, hand-washing stations and seating arrangements for senior devotees are provided.</p>',
                'description_mr' => '<p>मंदिराच्या प्रसाद सभागृहात दिवसभर सर्व भक्तांना ताजा महाप्रसाद दिला जातो. पारंपरिक पाककृतींचा वापर करून स्वच्छ, समर्पित स्वयंपाकघरात जेवण तयार केले जाते आणि पिढ्यानपिढ्या मंदिराचा भाग असलेल्या त्याच भक्तीने अर्पण केले जाते.</p><p>सभागृहात एका वेळी शेकडो भक्त आरामात बसू शकतात आणि सर्व मोठ्या उत्सवांमध्ये, साप्ताहिक पूजा आणि विशेष प्रसंगी ते उघडे असते. पिण्याचे पाणी, हात धुण्याची व्यवस्था आणि ज्येष्ठ भक्तांसाठी बसण्याची व्यवस्था करण्यात आली आहे.</p>',
            ],
            [
                'filename' => 'facility-shoe-stand.jpg',
                'title_en' => 'Shoe Stand & Cloak Room',
                'title_mr' => 'चप्पल स्टँड व क्लोक रूम',
                'description_en' => '<p>A safe and well-managed shoe stand is available right at the temple entrance, where devotees can leave their footwear before entering the sanctum. Tokens are issued for every pair to ensure secure return.</p><p>A small cloak room is also provided for bags, helmets and personal belongings during long darshan, abhishek or yatra programs, so that devotees can fully focus on prayer without any worry.</p>',
                'description_mr' => '<p>मंदिराच्या प्रवेशद्वाराजवळ सुरक्षित आणि व्यवस्थापित चप्पल स्टँड उपलब्ध आहे, जिथे भक्त गाभाऱ्यात प्रवेश करण्यापूर्वी आपली पादत्राणे ठेवू शकतात. सुरक्षित परत मिळण्यासाठी प्रत्येक जोडीसाठी टोकन दिले जाते.</p><p>दीर्घ दर्शन, अभिषेक किंवा यात्रा कार्यक्रमादरम्यान बॅग, हेल्मेट आणि वैयक्तिक सामान ठेवण्यासाठी एक छोटी क्लोक रूम देखील उपलब्ध आहे, जेणेकरून भक्तांना कोणतीही चिंता न करता पूर्णपणे प्रार्थनेवर लक्ष केंद्रित करता येईल.</p>',
            ],
        ];

        foreach ($facilities as $index => $data) {
            $path = 'media/' . $data['filename'];

            $media = Media::firstOrCreate(
                ['filename' => $data['filename']],
                [
                    'original_name' => $data['filename'],
                    'mime_type' => 'image/jpeg',
                    'file_size' => Storage::disk('public')->exists($path)
                        ? Storage::disk('public')->size($path)
                        : 0,
                    'file_path' => $path,
                    'file_url' => Storage::url($path),
                ]
            );

            Facility::updateOrCreate(
                ['slug' => Str::slug($data['title_en'])],
                [
                    'title_en' => $data['title_en'],
                    'title_hi' => $data['title_en'],
                    'title_mr' => $data['title_mr'],
                    'description_en' => $data['description_en'],
                    'description_hi' => $data['description_en'],
                    'description_mr' => $data['description_mr'],
                    'image_id' => $media->id,
                    'sort_order' => $index,
                    'is_active' => true,
                ]
            );
        }
    }
}
