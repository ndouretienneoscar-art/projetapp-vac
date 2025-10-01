<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraintToDemandeMesses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('demande_messes', function (Blueprint $table) {
    $table->unique(['TypeMesse', 'DateMesse', 'HeureMesse', 'Demandeur', 'Intention'], 'demande_unique');
});

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('demande_messes', function (Blueprint $table) {
            //
        });
    }
}
