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
        // Drop job_types table if it exists
        Schema::dropIfExists('job_types');

        // Ensure icon column exists on service_categories table
        if (Schema::hasTable('service_categories') && ! Schema::hasColumn('service_categories', 'icon')) {
            Schema::table('service_categories', function (Blueprint $table) {
                $table->string('icon')->nullable()->after('description');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('service_categories') && Schema::hasColumn('service_categories', 'icon')) {
            Schema::table('service_categories', function (Blueprint $table) {
                $table->dropColumn('icon');
            });
        }

        if (! Schema::hasTable('job_types')) {
            Schema::create('job_types', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->text('description')->nullable();
                $table->string('status')->default('ACTIVE');
                $table->timestamps();
            });
        }
    }
};
