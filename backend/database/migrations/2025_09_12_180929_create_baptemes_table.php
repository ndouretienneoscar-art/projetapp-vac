<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBaptemesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('baptemes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->date('naissance');
            $table->date('Datebapteme');
            $table->integer('AnneeBapteme');
            $table->enum('Confirme', ['Oui', 'Non']);
            $table->enum('Marie', ['Oui', 'Non']);
            $table->integer('NbrExemplaires');
            $table->string('Telephone');
            $table->string('Email');
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
        Schema::dropIfExists('baptemes');
    }
}
