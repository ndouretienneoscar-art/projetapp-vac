<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Confirmation extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'DateConfirmation',
        'LieuConfirmation',
        'NbrExemplaires',
        'Telephone',
        'Email',
    ];
}
