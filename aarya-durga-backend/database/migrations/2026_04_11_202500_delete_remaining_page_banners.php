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
            ->whereIn('page_key', ['history', 'events_gallery', 'pooja_donation'])
            ->whereIn('section_key', ['banner_quote', 'banner_image'])
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
