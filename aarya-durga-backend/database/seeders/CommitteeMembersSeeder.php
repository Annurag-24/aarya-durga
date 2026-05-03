<?php

namespace Database\Seeders;

use App\Models\CommitteeMember;
use App\Models\Media;
use Illuminate\Database\Seeder;

class CommitteeMembersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            [
                'filename' => 'committee-member-1.png',
                'name_en' => 'Rushikesh Jayant Patwardhan',
                'name_hi' => 'Rushikesh Jayant Patwardhan',
                'name_mr' => 'Rushikesh Jayant Patwardhan',
                'role_en' => 'President',
                'role_hi' => 'अध्यक्ष',
                'role_mr' => 'अध्यक्ष',
                'address_en' => '768, Patwardhan Wadi, Udyamnagar Road, Ratnagiri',
                'address_hi' => '768, पटवर्धन वाडी, उद्योगनगर रोड, रत्नागिरी',
                'address_mr' => '768, पटवर्धन वाडी, उद्योगनगर रोड, रत्नागिरी',
                'phone' => '+91 98765 10001',
                'sort_order' => 1,
                'file_size' => 12034,
            ],
            [
                'filename' => 'committee-member-2.png',
                'name_en' => 'Meera Anant Joshi',
                'name_hi' => 'Meera Anant Joshi',
                'name_mr' => 'Meera Anant Joshi',
                'role_en' => 'Vice President',
                'role_hi' => 'उपाध्यक्ष',
                'role_mr' => 'उपाध्यक्षा',
                'address_en' => '12, Shanti Sadan, Tilak Ali, Ratnagiri',
                'address_hi' => '12, शांति सदन, तिलक आळी, रत्नागिरी',
                'address_mr' => '12, शांती सदन, टिळक आळी, रत्नागिरी',
                'phone' => '+91 98765 10002',
                'sort_order' => 2,
                'file_size' => 14035,
            ],
            [
                'filename' => 'committee-member-3.png',
                'name_en' => 'Aniket Madhav Kulkarni',
                'name_hi' => 'Aniket Madhav Kulkarni',
                'name_mr' => 'Aniket Madhav Kulkarni',
                'role_en' => 'Secretary',
                'role_hi' => 'सचिव',
                'role_mr' => 'सचिव',
                'address_en' => '204, Ganesh Krupa, Maruti Mandir Road, Ratnagiri',
                'address_hi' => '204, गणेश कृपा, मारुति मंदिर रोड, रत्नागिरी',
                'address_mr' => '204, गणेश कृपा, मारुती मंदिर रोड, रत्नागिरी',
                'phone' => '+91 98765 10003',
                'sort_order' => 3,
                'file_size' => 19506,
            ],
            [
                'filename' => 'committee-member-4.png',
                'name_en' => 'Vaishnavi Suresh Deshpande',
                'name_hi' => 'Vaishnavi Suresh Deshpande',
                'name_mr' => 'Vaishnavi Suresh Deshpande',
                'role_en' => 'Treasurer',
                'role_hi' => 'कोषाध्यक्ष',
                'role_mr' => 'कोषाध्यक्षा',
                'address_en' => '9, Durga Nivas, Shivaji Nagar, Ratnagiri',
                'address_hi' => '9, दुर्गा निवास, शिवाजी नगर, रत्नागिरी',
                'address_mr' => '9, दुर्गा निवास, शिवाजी नगर, रत्नागिरी',
                'phone' => '+91 98765 10004',
                'sort_order' => 4,
                'file_size' => 13420,
            ],
            [
                'filename' => 'committee-member-5.png',
                'name_en' => 'Sandeep Vishnu Sawant',
                'name_hi' => 'Sandeep Vishnu Sawant',
                'name_mr' => 'Sandeep Vishnu Sawant',
                'role_en' => 'Trustee',
                'role_hi' => 'ट्रस्टी',
                'role_mr' => 'विश्वस्त',
                'address_en' => '44, Konkan Residency, Kuwarbav, Ratnagiri',
                'address_hi' => '44, कोंकण रेजिडेंसी, कुवारबाव, रत्नागिरी',
                'address_mr' => '44, कोकण रेसिडेन्सी, कुवारबाव, रत्नागिरी',
                'phone' => '+91 98765 10005',
                'sort_order' => 5,
                'file_size' => 13766,
            ],
        ];

        foreach ($members as $member) {
            $media = Media::updateOrCreate(
                ['filename' => $member['filename']],
                [
                    'original_name' => $member['filename'],
                    'file_path' => 'uploads/' . $member['filename'],
                    'file_url' => '/storage/uploads/' . $member['filename'],
                    'file_size' => $member['file_size'],
                    'mime_type' => 'image/png',
                    'width' => 256,
                    'height' => 256,
                ]
            );

            CommitteeMember::updateOrCreate(
                ['name_en' => $member['name_en']],
                [
                    'name_hi' => $member['name_hi'],
                    'name_mr' => $member['name_mr'],
                    'role_en' => $member['role_en'],
                    'role_hi' => $member['role_hi'],
                    'role_mr' => $member['role_mr'],
                    'address_en' => $member['address_en'],
                    'address_hi' => $member['address_hi'],
                    'address_mr' => $member['address_mr'],
                    'phone' => $member['phone'],
                    'photo_id' => $media->id,
                    'sort_order' => $member['sort_order'],
                ]
            );
        }
    }
}
