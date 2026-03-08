<?php

namespace Database\Seeders;

use App\Models\ContactSubject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSubjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContactSubject::firstOrCreate(
            ['label_en' => 'General Inquiry'],
            [
                'label_hi' => 'सामान्य पूछताछ',
                'label_mr' => 'सामान्य चौकशी',
            ]
        );

        ContactSubject::firstOrCreate(
            ['label_en' => 'Pooja Booking'],
            [
                'label_hi' => 'पूजा बुकिंग',
                'label_mr' => 'पूजा बुकिंग',
            ]
        );

        ContactSubject::firstOrCreate(
            ['label_en' => 'Donation'],
            [
                'label_hi' => 'दान',
                'label_mr' => 'देणगी',
            ]
        );

        ContactSubject::firstOrCreate(
            ['label_en' => 'Temple Visit'],
            [
                'label_hi' => 'मंदिर दर्शन',
                'label_mr' => 'मंदिर भेट',
            ]
        );

        ContactSubject::firstOrCreate(
            ['label_en' => 'Volunteer'],
            [
                'label_hi' => 'स्वयंसेवक',
                'label_mr' => 'स्वयंसेवक',
            ]
        );

        ContactSubject::firstOrCreate(
            ['label_en' => 'Other'],
            [
                'label_hi' => 'अन्य',
                'label_mr' => 'इतर',
            ]
        );
    }
}
