<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMariagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mariages', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->date('DateMariage');
            $table->string('AvecQui');
            $table->string('LieuMariage');
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
        Schema::dropIfExists('mariages');
    }
}
