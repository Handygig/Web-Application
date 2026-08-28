<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class ScrambleDocsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the viewApiDocs gate allows access to authenticated users.
     */
    public function test_view_api_docs_gate_allows_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->assertTrue(Gate::forUser($user)->allows('viewApiDocs'));
    }

    /**
     * Test that the viewApiDocs gate denies access to unauthenticated users.
     */
    public function test_view_api_docs_gate_denies_unauthenticated_user(): void
    {
        $this->assertFalse(Gate::allows('viewApiDocs'));
    }
}
