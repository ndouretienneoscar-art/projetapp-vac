<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Mariage;

class MariageController extends Controller
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
            return Mariage::where('user_id', $user->id)->get();
        }

        if ($role === 'secretaire') {
            return Mariage::where('statut', 'en_attente')->get();
        }

        if ($role === 'pretre') {
            return Mariage::all(); // ou filtrer selon besoin
        }

        return Mariage::all();
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

        $validated = $this->validateMariage($request);
        $validated['user_id'] = $user->id;

        $mariage = Mariage::create($validated);

        return response()->json($mariage, 201);
    }

    /**
     * Affiche une demande spécifique
     */
    public function show($id)
    {
        $mariage = Mariage::find($id);

        if (!$mariage) {
            return response()->json(['message' => 'Mariage non trouvé'], 404);
        }

        return response()->json($mariage);
    }

    /**
     * Met à jour une demande
     */
    public function update(Request $request, $id)
    {
        $mariage = Mariage::find($id);

        if (!$mariage) {
            return response()->json(['message' => 'Mariage non trouvé'], 404);
        }

        $validated = $this->validateMariage($request);

        $mariage->update($validated);

        return response()->json($mariage);
    }

    /**
     * Supprime une demande
     */
    public function destroy($id)
    {
        $mariage = Mariage::find($id);

        if (!$mariage) {
            return response()->json(['message' => 'Mariage non trouvé'], 404);
        }

        $mariage->delete();

        return response()->json(['message' => 'Mariage supprimé']);
    }

    /**
     * Validation centralisée
     */
    private function validateMariage(Request $request)
    {
        return $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'DateMariage' => 'required|date',
            'AvecQui' => 'required|string|max:100',
            'LieuMariage' => 'required|string|max:150',
            'NbrExemplaires' => 'required|integer|min:1',
            'Telephone' => 'required|string|max:20',
            'Email' => 'required|email|max:100',
        ]);
    }
}
