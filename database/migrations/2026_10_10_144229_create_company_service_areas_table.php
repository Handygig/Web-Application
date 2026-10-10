<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the simple pivot as it's being replaced by the advanced areas table
        Schema::dropIfExists('company_services');

        // Drop global location fields from companies
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'service_radius']);
        });

        // Create the advanced multi-area, multi-service mapping
        Schema::create('company_service_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('service_category_id')->constrained('service_categories')->cascadeOnDelete();
            $table->string('name')->nullable()->comment('e.g., North District Plumbing');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->unsignedInteger('service_radius')->comment('Radius in kilometers');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_service_areas');

        Schema::table('companies', function (Blueprint $table) {
            $table->decimal('latitude', 10, 8)->nullable()->after('address');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->unsignedInteger('service_radius')->default(30)->after('longitude');
        });

        Schema::create('company_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('service_category_id')->constrained('service_categories')->cascadeOnDelete();
            $table->timestamps();
        });
    }
};
