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
        if (Schema::hasTable('properties') && Schema::hasColumn('properties', 'property_type_id')) {
            Schema::table('properties', function (Blueprint $table) {
                try {
                    $table->dropForeign(['property_type_id']);
                } catch (\Throwable $e) {
                    // Ignore if foreign key constraint does not exist
                }
                $table->dropColumn('property_type_id');
            });
        }

        Schema::dropIfExists('property_types');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('property_types')) {
            Schema::create('property_types', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->text('description')->nullable();
                $table->string('status')->default('ACTIVE');
                $table->timestamps();
            });
        }

        if (Schema::hasTable('properties') && ! Schema::hasColumn('properties', 'property_type_id')) {
            Schema::table('properties', function (Blueprint $table) {
                $table->foreignId('property_type_id')->nullable()->constrained('property_types')->onDelete('set null');
            });
        }
    }
};
