<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update Users Table (Add company_id)
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->after('id')->constrained('companies')->nullOnDelete();
        });

        // 2. Update Quotations Table (Polymorphic Bidder)
        Schema::table('quotations', function (Blueprint $table) {
            $table->dropForeign(['provider_id']);
            $table->dropColumn('provider_id');
            $table->nullableMorphs('bidder');
        });

        // 3. Update Job Assignments Table (Make provider_id nullable)
        Schema::table('job_assignments', function (Blueprint $table) {
            $table->dropForeign(['provider_id']);
            // Laravel 11/10 supports changing to nullable directly
        });
        
        Schema::table('job_assignments', function (Blueprint $table) {
            $table->unsignedBigInteger('provider_id')->nullable()->change();
            $table->foreign('provider_id')->references('id')->on('providers')->cascadeOnDelete();
        });

        // 4. Update Spatie Permission Tables for Teams (company_id)
        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $teamKey = 'company_id';

        if (!empty($tableNames)) {
            Schema::table($tableNames['roles'], function (Blueprint $table) use ($teamKey) {
                $table->unsignedBigInteger($teamKey)->nullable()->after('id');
                $table->index($teamKey, 'roles_team_foreign_key_index');
                $table->dropUnique(['name', 'guard_name']);
                $table->unique([$teamKey, 'name', 'guard_name']);
            });

            Schema::table($tableNames['model_has_roles'], function (Blueprint $table) use ($teamKey, $columnNames) {
                $table->dropPrimary('model_has_roles_role_model_type_primary');
                $table->unsignedBigInteger($teamKey)->default(0)->after('role_id');
                $table->index($teamKey, 'model_has_roles_team_foreign_key_index');
                $table->primary([$teamKey, 'role_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_roles_role_model_type_primary');
            });

            Schema::table($tableNames['model_has_permissions'], function (Blueprint $table) use ($teamKey, $columnNames) {
                $table->dropPrimary('model_has_permissions_permission_model_type_primary');
                $table->unsignedBigInteger($teamKey)->default(0)->after('permission_id');
                $table->index($teamKey, 'model_has_permissions_team_foreign_key_index');
                $table->primary([$teamKey, 'permission_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_permission_model_type_primary');
            });
        }

        // 5. Create company_services table
        Schema::create('company_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('service_category_id')->constrained('service_categories')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_services');

        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $teamKey = 'company_id';

        if (!empty($tableNames)) {
            Schema::table($tableNames['model_has_permissions'], function (Blueprint $table) use ($teamKey, $columnNames) {
                $table->dropPrimary('model_has_permissions_permission_model_type_primary');
                $table->dropIndex('model_has_permissions_team_foreign_key_index');
                $table->dropColumn($teamKey);
                $table->primary(['permission_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_permission_model_type_primary');
            });

            Schema::table($tableNames['model_has_roles'], function (Blueprint $table) use ($teamKey, $columnNames) {
                $table->dropPrimary('model_has_roles_role_model_type_primary');
                $table->dropIndex('model_has_roles_team_foreign_key_index');
                $table->dropColumn($teamKey);
                $table->primary(['role_id', $columnNames['model_morph_key'], 'model_type'], 'model_has_roles_role_model_type_primary');
            });

            Schema::table($tableNames['roles'], function (Blueprint $table) use ($teamKey) {
                $table->dropUnique(['company_id', 'name', 'guard_name']);
                $table->dropIndex('roles_team_foreign_key_index');
                $table->dropColumn($teamKey);
                $table->unique(['name', 'guard_name']);
            });
        }

        Schema::table('job_assignments', function (Blueprint $table) {
            $table->dropForeign(['provider_id']);
        });
        
        Schema::table('job_assignments', function (Blueprint $table) {
            $table->unsignedBigInteger('provider_id')->nullable(false)->change();
            $table->foreign('provider_id')->references('id')->on('providers')->cascadeOnDelete();
        });

        Schema::table('quotations', function (Blueprint $table) {
            $table->dropMorphs('bidder');
            $table->foreignId('provider_id')->constrained('providers')->cascadeOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('company_id');
        });
    }
};
