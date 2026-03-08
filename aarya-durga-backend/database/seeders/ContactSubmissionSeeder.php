<?php

namespace Database\Seeders;

use App\Models\ContactSubmission;
use App\Models\ContactSubject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get subjects from database
        $poojaBooking = ContactSubject::where('label_en', 'Pooja Booking')->first()?->label_en ?? 'Pooja Booking';
        $donation = ContactSubject::where('label_en', 'Donation')->first()?->label_en ?? 'Donation';
        $volunteer = ContactSubject::where('label_en', 'Volunteer')->first()?->label_en ?? 'Volunteer';

        ContactSubmission::create([
            'name' => 'Rajesh Kumar',
            'email' => 'rajesh@example.com',
            'phone' => '+91 9876543210',
            'subject' => $poojaBooking,
            'message' => 'Hello, I would like to book a pooja for my family on the upcoming Diwali. Could you please provide more information about the available poojas and their pricing?',
        ]);

        ContactSubmission::create([
            'name' => 'Priya Sharma',
            'email' => 'priya.sharma@example.com',
            'phone' => '+91 8765432109',
            'subject' => $donation,
            'message' => 'I want to make a donation to the temple. What are the different ways I can contribute? Are there any specific projects or causes you are supporting right now?',
        ]);

        ContactSubmission::create([
            'name' => 'Amit Patel',
            'email' => 'amit.patel@example.com',
            'subject' => 'General Inquiry',
            'message' => 'Great website! Very informative about the temple and its activities. Keep up the good work!',
        ]);

        ContactSubmission::create([
            'name' => 'Deepa Singh',
            'email' => 'deepa@example.com',
            'phone' => '+91 7654321098',
            'subject' => $volunteer,
            'message' => 'I am interested in volunteering for the upcoming temple festival. Please let me know how I can participate and what roles are available.',
        ]);
    }
}
