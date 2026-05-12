<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_image', function (Blueprint $table) {
            $table->id();
            $table->foreignId('image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->text('caption_en')->nullable();
            $table->text('caption_hi')->nullable();
            $table->text('caption_mr')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_image');
    }
};
