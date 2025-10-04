<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Confirmation;

class ConfirmationController extends Controller
{
    /**
     * Affiche les demandes selon le rôle
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->role) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $role = $user->role->name;

        if ($role === 'demandeur') {
            return Confirmation::where('user_id', $user->id)->get();
        }

        if ($role === 'secretaire') {
            return Confirmation::where('statut', 'en_attente')->get();
        }

        if ($role === 'pretre') {
            return Confirmation::all(); // ou filtrer selon besoin
        }

        return Confirmation::all();
    }

    /**
     * Crée une nouvelle demande
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->role || $user->role->name !== 'demandeur') {
            return response()->json(['message' => 'Seuls les demandeurs peuvent soumettre une demande.'], 403);
        }

        $validated = $this->validateConfirmation($request);
        $validated['user_id'] = $user->id;

        $confirmation = Confirmation::create($validated);

        return response()->json($confirmation, 201);
    }

    /**
     * Affiche une demande spécifique
     */
    public function show($id)
    {
        $confirmation = Confirmation::find($id);

        if (!$confirmation) {
            return response()->json(['message' => 'Demande non trouvée'], 404);
        }

        return response()->json($confirmation);
    }

    /**
     * Met à jour une demande
     */
    public function update(Request $request, $id)
    {
        $confirmation = Confirmation::find($id);

        if (!$confirmation) {
            return response()->json(['message' => 'Confirmation non trouvée'], 404);
        }

        $validated = $this->validateConfirmation($request);

        $confirmation->update($validated);

        return response()->json($confirmation);
    }

    /**
     * Supprime une demande
     */
    public function destroy($id)
    {
        $confirmation = Confirmation::find($id);

        if (!$confirmation) {
            return response()->json(['message' => 'Confirmation non trouvée'], 404);
        }

        $confirmation->delete();

        return response()->json(['message' => 'Confirmation supprimée']);
    }

    /**
     * Validation centralisée
     */
    private function validateConfirmation(Request $request)
    {
        return $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'DateConfirmation' => 'required|date',
            'LieuConfirmation' => 'required|string|max:150',
            'NbrExemplaires' => 'required|integer|min:1',
            'Telephone' => 'required|string|max:20',
            'Email' => 'required|email|max:100',
        ]);
    }
}
