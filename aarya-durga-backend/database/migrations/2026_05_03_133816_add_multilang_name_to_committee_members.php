<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('committee_members', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('name');
            $table->string('name_hi')->nullable()->after('name_en');
            $table->string('name_mr')->nullable()->after('name_hi');
        });

        DB::table('committee_members')->get()->each(function ($member) {
            DB::table('committee_members')->where('id', $member->id)->update([
                'name_en' => $member->name,
                'name_hi' => $member->name,
                'name_mr' => $member->name,
            ]);
        });

        Schema::table('committee_members', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    public function down(): void
    {
        Schema::table('committee_members', function (Blueprint $table) {
            $table->string('name')->nullable()->after('role_mr');
        });

        DB::table('committee_members')->get()->each(function ($member) {
            DB::table('committee_members')->where('id', $member->id)->update([
                'name' => $member->name_en,
            ]);
        });

        Schema::table('committee_members', function (Blueprint $table) {
            $table->dropColumn(['name_en', 'name_hi', 'name_mr']);
        });
    }
};
