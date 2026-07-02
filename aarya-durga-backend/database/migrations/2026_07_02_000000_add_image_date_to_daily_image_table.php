<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('daily_image', function (Blueprint $table) {
            $table->date('image_date')->nullable()->unique()->after('day_number');
        });
    }

    public function down(): void
    {
        Schema::table('daily_image', function (Blueprint $table) {
            $table->dropUnique(['image_date']);
            $table->dropColumn('image_date');
        });
    }
};
