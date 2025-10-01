<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Mariage;

class MariageTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_mariage()
    {
        $data = [
            // Ajoutez ici les champs requis pour le modèle Mariage
            // 'nom' => 'Jean',
        ];

        $response = $this->postJson('/api/mariages', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('mariages', $data);
    }

    /** @test */
    public function it_lists_mariages()
    {
        Mariage::factory()->count(2)->create();
        $response = $this->getJson('/api/mariages');
        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

    /** @test */
    public function it_shows_a_mariage()
    {
        $mariage = Mariage::factory()->create();
        $response = $this->getJson('/api/mariages/' . $mariage->id);
        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $mariage->id]);
    }

    /** @test */
    public function it_updates_a_mariage()
    {
        $mariage = Mariage::factory()->create();
        $update = [
            // Ajoutez ici les champs à modifier
            // 'nom' => 'Paul',
        ];
        $response = $this->putJson('/api/mariages/' . $mariage->id, $update);
        $response->assertStatus(200);
        $this->assertDatabaseHas('mariages', $update);
    }

    /** @test */
    public function it_deletes_a_mariage()
    {
        $mariage = Mariage::factory()->create();
        $response = $this->deleteJson('/api/mariages/' . $mariage->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('mariages', ['id' => $mariage->id]);
    }
}
