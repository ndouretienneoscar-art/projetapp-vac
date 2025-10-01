<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeMesse extends Model
{
    protected $table = 'demande_messes';

    protected $fillable = [
        'type_messe',
        'montant',
        'intention',
        'beneficiaire',
        'date_messe',
        'heure_messe',
        'demandeur',
        'telephone_demandeur',
        'statut',
    ];
}
