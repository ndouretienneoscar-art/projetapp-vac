<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 🔐 Contrôleurs
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DemandeMesseController;
use App\Http\Controllers\BaptemeController;
use App\Http\Controllers\ConfirmationController;
use App\Http\Controllers\MariageController;
use App\Http\Controllers\RoleController;

// 🔐 Authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

// 🔍 Récupération de l'utilisateur connecté avec son rôle
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user()->load('role');
});

// 👤 DEMANDEUR : accès aux formulaires uniquement
Route::middleware(['auth:sanctum', 'role:demandeur'])->group(function () {
    Route::post('demandemesses', [DemandeMesseController::class, 'store']);
    Route::post('baptemes', [BaptemeController::class, 'store']);
    Route::post('mariages', [MariageController::class, 'store']);
    Route::post('confirmations', [ConfirmationController::class, 'store']);
});

// 🗂️ SECRETAIRE : gestion des demandes de messes uniquement
Route::middleware(['auth:sanctum', 'role:secretaire'])->group(function () {
    Route::get('demandemesses', [DemandeMesseController::class, 'index']);
    Route::get('demandemesses/{id}', [DemandeMesseController::class, 'show']);
    Route::put('demandemesses/{id}/changer-statut', [DemandeMesseController::class, 'changerStatut']);
    Route::put('demandemesses/{id}/paiement', [DemandeMesseController::class, 'updatePaiement']);
    Route::put('demandemesses/{id}/transfer', [DemandeMesseController::class, 'transferToPretre']);
});

// ✝️ PRÊTRE : accès à tous les tableaux
Route::middleware(['auth:sanctum', 'role:pretre'])->group(function () {
    // Messes
    Route::get('demandemesses', [DemandeMesseController::class, 'index']);
    Route::get('demandemesses/{id}', [DemandeMesseController::class, 'show']);
    Route::put('demandemesses/{id}/changer-statut', [DemandeMesseController::class, 'changerStatut']);

    // Baptêmes
    Route::get('baptemes', [BaptemeController::class, 'index']);
    Route::get('baptemes/{id}', [BaptemeController::class, 'show']);

    // Mariages
    Route::get('mariages', [MariageController::class, 'index']);
    Route::get('mariages/{id}', [MariageController::class, 'show']);

    // Confirmations
    Route::get('confirmations', [ConfirmationController::class, 'index']);
    Route::get('confirmations/{id}', [ConfirmationController::class, 'show']);
});

// 🛡️ ADMIN : gestion des rôles (si rôle admin ajouté plus tard)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('roles', RoleController::class);
});
