<?php

namespace Tests\Feature;

use Tests\TestCase;

class LocaleTest extends TestCase
{
    public function test_locale_can_be_updated(): void
    {
        $response = $this->from('/dashboard')->post('/locale', [
            'locale' => 'si',
        ]);

        $response
            ->assertRedirect('/dashboard')
            ->assertSessionHas('locale', 'si');
    }

    public function test_locale_must_be_supported(): void
    {
        $response = $this->from('/dashboard')->post('/locale', [
            'locale' => 'fr',
        ]);

        $response
            ->assertRedirect('/dashboard')
            ->assertSessionHasErrors('locale');
    }
}
