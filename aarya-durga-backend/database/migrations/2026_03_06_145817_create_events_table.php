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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_hi');
            $table->string('title_mr');
            $table->string('date_label_en')->nullable();
            $table->string('date_label_hi')->nullable();
            $table->string('date_label_mr')->nullable();
            $table->date('event_date')->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_hi')->nullable();
            $table->text('description_mr')->nullable();
            $table->enum('category', ['Festival', 'Yatra', 'Pooja'])->default('Festival');
            $table->unsignedBigInteger('image_id')->nullable();
            $table->foreign('image_id')->references('id')->on('media')->onDelete('set null');
            $table->tinyInteger('is_active')->default(1);
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
        Schema::dropIfExists('events');
    }
};
