<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_details', function (Blueprint $table) {
            $table->unsignedBigInteger('qr_image_id')->nullable()->after('upi_id');
            $table->foreign('qr_image_id')->references('id')->on('media')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('bank_details', function (Blueprint $table) {
            $table->dropForeign(['qr_image_id']);
            $table->dropColumn('qr_image_id');
        });
    }
};
