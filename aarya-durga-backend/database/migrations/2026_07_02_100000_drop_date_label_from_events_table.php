<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['date_label_en', 'date_label_hi', 'date_label_mr']);
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('date_label_en')->nullable();
            $table->string('date_label_hi')->nullable();
            $table->string('date_label_mr')->nullable();
        });
    }
};
