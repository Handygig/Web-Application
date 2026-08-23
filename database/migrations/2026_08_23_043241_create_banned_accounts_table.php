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
        Schema::create('banned_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('account_type')->default('CUSTOMER');
            $table->string('ban_type')->default('TEMPORARY');
            $table->text('reason');
            $table->text('notes')->nullable();
            $table->foreignId('banned_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('banned_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->string('status')->default('ACTIVE');
            $table->foreignId('unbanned_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('unbanned_at')->nullable();
            $table->json('moderation_history')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banned_accounts');
    }
};
