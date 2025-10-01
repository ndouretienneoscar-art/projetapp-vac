<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Confirmation;

class ConfirmationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_confirmation()
    {
        $data = [
            // Ajoutez ici les champs requis pour le modèle Confirmation
        ];
        $response = $this->postJson('/api/confirmations', $data);
        $response->assertStatus(201);
        $this->assertDatabaseHas('confirmations', $data);
    }

    /** @test */
    public function it_lists_confirmations()
    {
        Confirmation::factory()->count(2)->create();
        $response = $this->getJson('/api/confirmations');
        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

    /** @test */
    public function it_shows_a_confirmation()
    {
        $confirmation = Confirmation::factory()->create();
        $response = $this->getJson('/api/confirmations/' . $confirmation->id);
        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $confirmation->id]);
    }

    /** @test */
    public function it_updates_a_confirmation()
    {
        $confirmation = Confirmation::factory()->create();
        $update = [
            // Ajoutez ici les champs à modifier
        ];
        $response = $this->putJson('/api/confirmations/' . $confirmation->id, $update);
        $response->assertStatus(200);
        $this->assertDatabaseHas('confirmations', $update);
    }

    /** @test */
    public function it_deletes_a_confirmation()
    {
        $confirmation = Confirmation::factory()->create();
        $response = $this->deleteJson('/api/confirmations/' . $confirmation->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('confirmations', ['id' => $confirmation->id]);
    }
}
