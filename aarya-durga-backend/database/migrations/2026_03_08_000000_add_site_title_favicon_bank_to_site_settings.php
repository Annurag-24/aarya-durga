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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('site_title')->nullable();
            $table->unsignedBigInteger('favicon_id')->nullable();
            $table->foreign('favicon_id')->references('id')->on('media')->nullOnDelete();
            $table->unsignedBigInteger('logo_id')->nullable();
            $table->foreign('logo_id')->references('id')->on('media')->nullOnDelete();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_branch')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_ifsc')->nullable();
            $table->string('upi_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            if (Schema::hasColumn('site_settings', 'favicon_id')) {
                $table->dropForeign('site_settings_favicon_id_foreign');
            }
            if (Schema::hasColumn('site_settings', 'logo_id')) {
                $table->dropForeign('site_settings_logo_id_foreign');
            }
            $table->dropColumn([
                'site_title',
                'favicon_id',
                'logo_id',
                'bank_account_name',
                'bank_name',
                'bank_branch',
                'bank_account_number',
                'bank_ifsc',
                'upi_id',
            ]);
        });
    }
};
