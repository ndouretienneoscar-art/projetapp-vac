<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\DemandeMesse;

class DemandeMesseTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_demande_messe()
    {
        $data = [
            // Ajoutez ici les champs requis pour le modèle DemandeMesse
        ];
        $response = $this->postJson('/api/demandemesses', $data);
        $response->assertStatus(201);
        $this->assertDatabaseHas('demande_messes', $data);
    }

    /** @test */
    public function it_lists_demande_messes()
    {
        DemandeMesse::factory()->count(2)->create();
        $response = $this->getJson('/api/demandemesses');
        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

    /** @test */
    public function it_shows_a_demande_messe()
    {
        $demandeMesse = DemandeMesse::factory()->create();
        $response = $this->getJson('/api/demandemesses/' . $demandeMesse->id);
        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $demandeMesse->id]);
    }

    /** @test */
    public function it_updates_a_demande_messe()
    {
        $demandeMesse = DemandeMesse::factory()->create();
        $update = [
            // Ajoutez ici les champs à modifier
        ];
        $response = $this->putJson('/api/demandemesses/' . $demandeMesse->id, $update);
        $response->assertStatus(200);
        $this->assertDatabaseHas('demande_messes', $update);
    }

    /** @test */
    public function it_deletes_a_demande_messe()
    {
        $demandeMesse = DemandeMesse::factory()->create();
        $response = $this->deleteJson('/api/demandemesses/' . $demandeMesse->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('demande_messes', ['id' => $demandeMesse->id]);
    }
}
