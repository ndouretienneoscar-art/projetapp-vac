<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DemandeMesse extends Model
{
    use HasFactory;

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
        'user_id',
        'statut',
        'pretre_id',
        'paiement',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
