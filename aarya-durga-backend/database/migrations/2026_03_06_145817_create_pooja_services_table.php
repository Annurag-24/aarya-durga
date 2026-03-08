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
        Schema::create('pooja_services', function (Blueprint $table) {
            $table->id();
            $table->string('title_en');
            $table->string('title_hi');
            $table->string('title_mr');
            $table->string('schedule_en')->nullable();
            $table->string('schedule_hi')->nullable();
            $table->string('schedule_mr')->nullable();
            $table->text('description_en')->nullable();
            $table->text('description_hi')->nullable();
            $table->text('description_mr')->nullable();
            $table->string('price')->nullable();
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
        Schema::dropIfExists('pooja_services');
    }
};
