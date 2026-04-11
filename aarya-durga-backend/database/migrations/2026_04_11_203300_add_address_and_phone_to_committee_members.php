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
        Schema::table('committee_members', function (Blueprint $table) {
            $table->text('address_en')->nullable()->after('role_mr');
            $table->text('address_hi')->nullable()->after('address_en');
            $table->text('address_mr')->nullable()->after('address_hi');
            $table->string('phone')->nullable()->after('address_mr');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('committee_members', function (Blueprint $table) {
            $table->dropColumn(['address_en', 'address_hi', 'address_mr', 'phone']);
        });
    }
};

