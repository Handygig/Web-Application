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
        // 1. Add reward and referral columns to customers table
        Schema::table('customers', function (Blueprint $table) {
            $table->unsignedInteger('reward_points')->default(1250)->after('gender');
            $table->decimal('wallet_balance', 10, 2)->default(45.00)->after('reward_points');
            $table->string('membership_tier')->default('Gold Member')->after('wallet_balance');
            $table->string('referral_code', 32)->nullable()->unique()->after('membership_tier');
            $table->foreignId('referred_by_id')->nullable()->after('referral_code')->constrained('customers')->nullOnDelete();
        });

        // 2. Create reward_transactions ledger table
        Schema::create('reward_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->enum('type', [
                'points_earned',
                'points_redeemed',
                'wallet_credit',
                'wallet_debit',
                'referral_bonus',
            ]);
            $table->integer('points')->default(0);
            $table->decimal('amount', 10, 2)->default(0.00);
            $table->string('description');
            $table->string('reference_id')->nullable();
            $table->timestamps();
        });

        // 3. Create reward_settings table for dynamic admin configuration
        Schema::create('reward_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward_transactions');
        Schema::dropIfExists('reward_settings');

        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['referred_by_id']);
            $table->dropColumn([
                'reward_points',
                'wallet_balance',
                'membership_tier',
                'referral_code',
                'referred_by_id',
            ]);
        });
    }
};
