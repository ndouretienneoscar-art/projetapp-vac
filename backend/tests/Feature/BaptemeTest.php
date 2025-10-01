<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Bapteme;

class BaptemeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_bapteme()
    {
        $data = [
            // Ajoutez ici les champs requis pour le modèle Bapteme
        ];
        $response = $this->postJson('/api/baptemes', $data);
        $response->assertStatus(201);
        $this->assertDatabaseHas('baptemes', $data);
    }

    /** @test */
    public function it_lists_baptemes()
    {
        Bapteme::factory()->count(2)->create();
        $response = $this->getJson('/api/baptemes');
        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

    /** @test */
    public function it_shows_a_bapteme()
    {
        $bapteme = Bapteme::factory()->create();
        $response = $this->getJson('/api/baptemes/' . $bapteme->id);
        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $bapteme->id]);
    }

    /** @test */
    public function it_updates_a_bapteme()
    {
        $bapteme = Bapteme::factory()->create();
        $update = [
            // Ajoutez ici les champs à modifier
        ];
        $response = $this->putJson('/api/baptemes/' . $bapteme->id, $update);
        $response->assertStatus(200);
        $this->assertDatabaseHas('baptemes', $update);
    }

    /** @test */
    public function it_deletes_a_bapteme()
    {
        $bapteme = Bapteme::factory()->create();
        $response = $this->deleteJson('/api/baptemes/' . $bapteme->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('baptemes', ['id' => $bapteme->id]);
    }
}
