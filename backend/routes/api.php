
<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;

// 🔐 Authentification
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

// 🔍 Récupération de l'utilisateur connecté avec son rôle
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user()->load('role');
});


// 🛡️ Routes réservées à l'admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('roles', App\Http\Controllers\RoleController::class);
    // Tu peux ajouter ici d'autres routes admin
});


// 🗂️ Routes réservées au secrétaire
Route::middleware(['auth:sanctum', 'role:secretaire'])->group(function () {
    // Messe
    Route::get('demandemesses', [App\Http\Controllers\DemandeMesseController::class, 'index']);
    Route::get('demandemesses/{id}', [App\Http\Controllers\DemandeMesseController::class, 'show']);
    Route::post('demandemesses/{id}/transfer', [App\Http\Controllers\DemandeMesseController::class, 'transferToPretre']);

    // Baptême
    Route::get('baptemes', [App\Http\Controllers\BaptemeController::class, 'index']);
    Route::get('baptemes/{id}', [App\Http\Controllers\BaptemeController::class, 'show']);
    Route::post('baptemes/{id}/transfer', [App\Http\Controllers\BaptemeController::class, 'transferToPretre']);

    // Mariage
    Route::get('mariages', [App\Http\Controllers\MariageController::class, 'index']);
    Route::get('mariages/{id}', [App\Http\Controllers\MariageController::class, 'show']);
    Route::post('mariages/{id}/transfer', [App\Http\Controllers\MariageController::class, 'transferToPretre']);

    // Confirmation
    Route::get('confirmations', [App\Http\Controllers\ConfirmationController::class, 'index']);
    Route::get('confirmations/{id}', [App\Http\Controllers\ConfirmationController::class, 'show']);
    Route::post('confirmations/{id}/transfer', [App\Http\Controllers\ConfirmationController::class, 'transferToPretre']);
});


// ✝️ Routes réservées au prêtre
Route::middleware(['auth:sanctum', 'role:pretre'])->group(function () {
    // Messe
    Route::get('demandemesses', [App\Http\Controllers\DemandeMesseController::class, 'index']);
    Route::get('demandemesses/{id}', [App\Http\Controllers\DemandeMesseController::class, 'show']);
    Route::post('demandemesses/{id}/changer-statut', [App\Http\Controllers\DemandeMesseController::class, 'changerStatut']);

    // Baptême
    Route::get('baptemes', [App\Http\Controllers\BaptemeController::class, 'index']);
    Route::get('baptemes/{id}', [App\Http\Controllers\BaptemeController::class, 'show']);
    Route::post('baptemes/{id}/changer-statut', [App\Http\Controllers\BaptemeController::class, 'changerStatut']);

    // Mariage
    Route::get('mariages', [App\Http\Controllers\MariageController::class, 'index']);
    Route::get('mariages/{id}', [App\Http\Controllers\MariageController::class, 'show']);
    Route::post('mariages/{id}/changer-statut', [App\Http\Controllers\MariageController::class, 'changerStatut']);

    // Confirmation
    Route::get('confirmations', [App\Http\Controllers\ConfirmationController::class, 'index']);
    Route::get('confirmations/{id}', [App\Http\Controllers\ConfirmationController::class, 'show']);
    Route::post('confirmations/{id}/changer-statut', [App\Http\Controllers\ConfirmationController::class, 'changerStatut']);
});


// 👤 Routes réservées au demandeur
Route::middleware(['auth:sanctum', 'role:demandeur'])->group(function () {
    Route::apiResource('demandemesses', App\Http\Controllers\DemandeMesseController::class)->only(['index', 'store']);
    Route::apiResource('confirmations', App\Http\Controllers\ConfirmationController::class)->only(['index', 'store']);
    Route::apiResource('mariages', App\Http\Controllers\MariageController::class)->only(['store']);
    Route::apiResource('baptemes', App\Http\Controllers\BaptemeController::class)->only(['store']);
});
