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
        // Add image to service_categories if not exists
        if (Schema::hasTable('service_categories') && ! Schema::hasColumn('service_categories', 'image')) {
            Schema::table('service_categories', function (Blueprint $table) {
                $table->string('image')->nullable()->after('description');
            });
        }

        // Create services table
        if (! Schema::hasTable('services')) {
            Schema::create('services', function (Blueprint $table) {
                $table->id();
                $table->foreignId('service_category_id')->constrained('service_categories')->cascadeOnDelete();
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('base_price', 10, 2)->nullable();
                $table->string('image')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');

        if (Schema::hasTable('service_categories') && Schema::hasColumn('service_categories', 'image')) {
            Schema::table('service_categories', function (Blueprint $table) {
                $table->dropColumn('image');
            });
        }
    }
};
