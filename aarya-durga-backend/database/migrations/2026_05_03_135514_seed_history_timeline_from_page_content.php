<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $keys = ['ancient', 'medieval', 'colonial', 'post_independence', 'modern_day'];

        foreach ($keys as $index => $key) {
            $era = DB::table('page_content')->where('page_key', 'history')->where('section_key', $key . '_era')->first();
            $title = DB::table('page_content')->where('page_key', 'history')->where('section_key', $key . '_title')->first();
            $description = DB::table('page_content')->where('page_key', 'history')->where('section_key', $key . '_description')->first();

            if (! $era && ! $title) {
                continue;
            }

            $exists = DB::table('history_timeline')
                ->where('era_label_en', $era->content_en ?? '')
                ->where('title_en', $title->content_en ?? '')
                ->exists();

            if ($exists) {
                continue;
            }

            DB::table('history_timeline')->insert([
                'era_label_en' => $era->content_en ?? '',
                'era_label_hi' => $era->content_hi ?? ($era->content_en ?? ''),
                'era_label_mr' => $era->content_mr ?? ($era->content_en ?? ''),
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
                    $query->orWhere('section_key', $key . '_era')
                        ->orWhere('section_key', $key . '_title')
                        ->orWhere('section_key', $key . '_description');
                }
            })
            ->delete();
    }

    public function down(): void
    {
        // Irreversible data migration
    }
};
