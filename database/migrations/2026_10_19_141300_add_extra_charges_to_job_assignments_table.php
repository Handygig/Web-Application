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
        Schema::table('job_assignments', function (Blueprint $table) {
            $table->decimal('extra_amount', 10, 2)->nullable()->after('end_date');
            $table->text('extra_reason')->nullable()->after('extra_amount');
            $table->string('extra_status')->default('none')->after('extra_reason'); // none, pending, approved, rejected
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_assignments', function (Blueprint $table) {
            $table->dropColumn(['extra_amount', 'extra_reason', 'extra_status']);
        });
    }
};
