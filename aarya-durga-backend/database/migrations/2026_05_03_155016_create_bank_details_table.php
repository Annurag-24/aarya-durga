<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_details', function (Blueprint $table) {
            $table->id();
            $table->string('account_name')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('branch')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('upi_id')->nullable();
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });

        $existing = DB::table('site_settings')->first();
        if ($existing && ($existing->bank_account_name || $existing->bank_name)) {
            DB::table('bank_details')->insert([
                'account_name' => $existing->bank_account_name,
                'bank_name' => $existing->bank_name,
                'branch' => $existing->bank_branch,
                'account_number' => $existing->bank_account_number,
                'ifsc_code' => $existing->bank_ifsc,
                'upi_id' => $existing->upi_id,
                'sort_order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_details');
    }
};
