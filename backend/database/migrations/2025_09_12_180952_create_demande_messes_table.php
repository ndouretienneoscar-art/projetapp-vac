<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDemandeMessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('demande_messes', function (Blueprint $table) {
    $table->id();
    $table->enum('type_messe', ['requiem', 'simple', 'neuvaine', 'trentaine']);
    $table->string('montant')->nullable();
    $table->text('intention');
    $table->string('beneficiaire');
    $table->date('date_messe');
    $table->time('heure_messe');
    $table->string('demandeur');
    $table->string('telephone_demandeur');
    $table->enum('statut', ['en_attente', 'transmis_secretaire', 'transmis_pretre', 'traite'])->default('en_attente');
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('demande_messes');
    }
}
