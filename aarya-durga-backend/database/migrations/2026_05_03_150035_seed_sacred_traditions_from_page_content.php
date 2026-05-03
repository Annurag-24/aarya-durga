<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $keys = ['navratri', 'texts', 'konkan', 'diwali'];

        foreach ($keys as $index => $key) {
            $title = DB::table('page_content')->where('page_key', 'history')->where('section_key', $key . '_title')->first();
            $description = DB::table('page_content')->where('page_key', 'history')->where('section_key', $key . '_description')->first();

            if (! $title) {
                continue;
            }

            $exists = DB::table('sacred_traditions')
                ->where('title_en', $title->content_en ?? '')
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('sacred_traditions')->insert([
                'title_en' => $title->content_en ?? '',
                'title_hi' => $title->content_hi ?? ($title->content_en ?? ''),
                'title_mr' => $title->content_mr ?? ($title->content_en ?? ''),
                'description_en' => $description->content_en ?? null,
                'description_hi' => $description->content_hi ?? null,
                'description_mr' => $description->content_mr ?? null,
                'sort_order' => $index,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('page_content')
            ->where('page_key', 'history')
            ->where(function ($query) use ($keys) {
                foreach ($keys as $key) {
                    $query->orWhere('section_key', $key . '_title')
                        ->orWhere('section_key', $key . '_description');
                }
            })
            ->delete();
    }

    public function down(): void
    {
        // Irreversible
    }
};
