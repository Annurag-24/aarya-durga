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
                'member1_title',
                'member1_subtitle',
                'member2_title',
                'member2_subtitle',
                'member3_title',
                'member3_subtitle',
            ])
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
