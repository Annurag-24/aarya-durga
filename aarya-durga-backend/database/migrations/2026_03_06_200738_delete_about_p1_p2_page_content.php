<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Delete old about_p1 and about_p2 page content records
        DB::table('page_content')->where('page_key', 'home')
            ->whereIn('section_key', ['about_p1', 'about_p2'])
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to restore
    }
};
