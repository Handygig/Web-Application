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
        if (Schema::hasTable('services') && Schema::hasColumn('services', 'base_price')) {
            Schema::table('services', function (Blueprint $table) {
                $table->dropColumn('base_price');
            });
        }

        if (Schema::hasTable('job_requests')) {
            Schema::table('job_requests', function (Blueprint $table) {
                if (! Schema::hasColumn('job_requests', 'payment_method')) {
                    $table->string('payment_method')->default('card')->after('status');
                }
                if (! Schema::hasColumn('job_requests', 'card_id')) {
                    $table->foreignId('card_id')->nullable()->after('payment_method')->constrained('customer_cards')->nullOnDelete();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('job_requests')) {
            Schema::table('job_requests', function (Blueprint $table) {
                if (Schema::hasColumn('job_requests', 'card_id')) {
                    $table->dropForeign(['card_id']);
                    $table->dropColumn('card_id');
                }
                if (Schema::hasColumn('job_requests', 'payment_method')) {
                    $table->dropColumn('payment_method');
                }
            });
        }

        if (Schema::hasTable('services') && ! Schema::hasColumn('services', 'base_price')) {
            Schema::table('services', function (Blueprint $table) {
                $table->decimal('base_price', 10, 2)->nullable();
            });
        }
    }
};
