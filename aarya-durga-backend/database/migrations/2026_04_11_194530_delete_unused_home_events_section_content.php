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
            ->where('page_key', 'home')
            ->whereIn('section_key', [
                'events_title',
                'events_description',
            ])
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left empty. Events content is managed under events_gallery.
    }
};
