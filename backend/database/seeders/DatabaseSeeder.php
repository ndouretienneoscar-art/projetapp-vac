<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        // Création des rôles
        $demandeurRole = \App\Models\Role::firstOrCreate(['name' => 'demandeur']);
        $secretaireRole = \App\Models\Role::firstOrCreate(['name' => 'secretaire']);
        $pretreRole = \App\Models\Role::firstOrCreate(['name' => 'pretre']);

        // Création des utilisateurs
        \App\Models\User::create([
            'name' => 'NDOUR',
            'prenom' => 'Jean Michel',
            'email' => 'jean@example.com',
            'password' => bcrypt('password1'),
            'role_id' => $demandeurRole->id,
        ]);
        \App\Models\User::create([
            'name' => 'BANDAGNY',
            'prenom' => 'Delphine Deletos',
            'email' => 'fina@example.com',
            'password' => bcrypt('password2'),
            'role_id' => $secretaireRole->id,
        ]);
        \App\Models\User::create([
            'name' => 'NDOUR',
            'prenom' => 'Abbé Etienne Mbade',
            'email' => 'abbetienne@example.com',
            'password' => bcrypt('password3'),
            'role_id' => $pretreRole->id,
        ]);
    }
}
