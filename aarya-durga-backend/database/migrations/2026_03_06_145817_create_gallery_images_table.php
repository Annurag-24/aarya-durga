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
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('image_id');
            $table->foreign('image_id')->references('id')->on('media')->onDelete('cascade');
            $table->string('alt_en')->nullable();
            $table->string('alt_hi')->nullable();
            $table->string('alt_mr')->nullable();
            $table->string('caption_en')->nullable();
            $table->string('caption_hi')->nullable();
            $table->string('caption_mr')->nullable();
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
