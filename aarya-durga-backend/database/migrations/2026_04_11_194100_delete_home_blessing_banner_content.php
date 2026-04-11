<?php

use App\Models\PageContent;
use App\Models\Quote;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        PageContent::query()
            ->where('page_key', 'home')
            ->whereIn('section_key', [
                'blessing_title',
                'blessing_content',
                'blessing_image',
            ])
            ->delete();

        Quote::query()
            ->where('placement', 'home_blessing')
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left empty. Seeders can restore default content if needed.
    }
};
