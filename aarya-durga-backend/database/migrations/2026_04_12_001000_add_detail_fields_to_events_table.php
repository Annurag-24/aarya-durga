<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title_mr');
            $table->text('summary_en')->nullable()->after('description_mr');
            $table->text('summary_hi')->nullable()->after('summary_en');
            $table->text('summary_mr')->nullable()->after('summary_hi');
            $table->longText('details_en')->nullable()->after('summary_mr');
            $table->longText('details_hi')->nullable()->after('details_en');
            $table->longText('details_mr')->nullable()->after('details_hi');
            $table->string('location_en')->nullable()->after('details_mr');
            $table->string('location_hi')->nullable()->after('location_en');
            $table->string('location_mr')->nullable()->after('location_hi');
            $table->string('time_en')->nullable()->after('location_mr');
            $table->string('time_hi')->nullable()->after('time_en');
            $table->string('time_mr')->nullable()->after('time_hi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn([
                'slug',
                'summary_en',
                'summary_hi',
                'summary_mr',
                'details_en',
                'details_hi',
                'details_mr',
                'location_en',
                'location_hi',
                'location_mr',
                'time_en',
                'time_hi',
                'time_mr',
            ]);
        });
    }
};
