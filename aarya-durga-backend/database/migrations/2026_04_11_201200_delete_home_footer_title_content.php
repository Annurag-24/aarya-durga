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
            ->where('section_key', 'footer_title')
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
