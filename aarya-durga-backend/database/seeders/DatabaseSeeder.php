<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(AdminSeeder::class);
        $this->call(SiteSettingsSeeder::class);
        $this->call(DemoDataSeeder::class);
        $this->call(HomePageSeeder::class);
        $this->call(AboutUsSeeder::class);
        $this->call(HistoryPageSeeder::class);
        $this->call(PoojaAndDonationPageSeeder::class);
        $this->call(EventsGalleryPageSeeder::class);
        $this->call(ContactPageSeeder::class);
        $this->call(ContactSubjectsSeeder::class);
        $this->call(ContactSubmissionSeeder::class);
    }
}
