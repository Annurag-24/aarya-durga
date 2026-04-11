<?php

use App\Models\PageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        PageContent::query()
            ->where('page_key', 'about')
            ->whereIn('section_key', [
                'hero_title',
                'hero_subtitle',
                'hero_image',
                'about_image',
            ])
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left empty. Seeder defaults can restore these records if needed.
    }
};
