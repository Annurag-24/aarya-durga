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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('temple_name_en')->nullable();
            $table->string('temple_name_hi')->nullable();
            $table->string('temple_name_mr')->nullable();
            $table->string('address_line1_en')->nullable();
            $table->string('address_line1_hi')->nullable();
            $table->string('address_line1_mr')->nullable();
            $table->string('address_line2_en')->nullable();
            $table->string('address_line2_hi')->nullable();
            $table->string('address_line2_mr')->nullable();
            $table->string('address_line3_en')->nullable();
            $table->string('address_line3_hi')->nullable();
            $table->string('address_line3_mr')->nullable();
            $table->string('phone_primary')->nullable();
            $table->string('phone_secondary')->nullable();
            $table->string('email_general')->nullable();
            $table->string('email_pooja')->nullable();
            $table->text('google_maps_embed_url')->nullable();
            $table->string('darshan_morning')->nullable();
            $table->string('darshan_evening')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->text('copyright_en')->nullable();
            $table->text('copyright_hi')->nullable();
            $table->text('copyright_mr')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
