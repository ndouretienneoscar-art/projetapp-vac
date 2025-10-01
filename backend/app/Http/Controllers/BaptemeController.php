<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Bapteme;

class BaptemeController extends Controller
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
            return Bapteme::where('user_id', $user->id)->get();
        }

        if ($role === 'secretaire') {
            return Bapteme::where('statut', 'en_attente')->get();
        }

        if ($role === 'pretre') {
            return Bapteme::where('statut', 'transmis_secretaire')->get();
        }

        return Bapteme::all();
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

        $validated = $this->validateBapteme($request);
        $validated['user_id'] = $user->id;

        $bapteme = Bapteme::create($validated);

        return response()->json($bapteme, 201);
    }

    /**
     * Affiche une demande spécifique
     */
    public function show($id)
    {
        $bapteme = Bapteme::find($id);

        if (!$bapteme) {
            return response()->json(['message' => 'Baptême non trouvé'], 404);
        }

        return response()->json($bapteme);
    }

    /**
     * Met à jour une demande
     */
    public function update(Request $request, $id)
    {
        $bapteme = Bapteme::find($id);

        if (!$bapteme) {
            return response()->json(['message' => 'Baptême non trouvé'], 404);
        }

        $validated = $this->validateBapteme($request);

        $bapteme->update($validated);

        return response()->json($bapteme);
    }

    /**
     * Supprime une demande
     */
    public function destroy($id)
    {
        $bapteme = Bapteme::find($id);

        if (!$bapteme) {
            return response()->json(['message' => 'Baptême non trouvé'], 404);
        }

        $bapteme->delete();

        return response()->json(['message' => 'Baptême supprimé']);
    }

    /**
     * Transfère une demande au prêtre
     */
    public function transferToPretre($id, Request $request)
    {
        $bapteme = Bapteme::find($id);

        if (!$bapteme) {
            return response()->json(['message' => 'Baptême non trouvé'], 404);
        }

        $bapteme->statut = 'transmis_secretaire';

        if ($request->filled('pretre_id')) {
            $bapteme->pretre_id = $request->input('pretre_id');
        }

        $bapteme->save();

        return response()->json(['message' => 'Demande de baptême transférée au prêtre', 'bapteme' => $bapteme]);
    }

    /**
     * Change le statut selon le rôle
     */
    public function changerStatut(Request $request, $id)
    {
        $user = Auth::user();
        $bapteme = Bapteme::find($id);

        if (!$bapteme) {
            return response()->json(['message' => 'Baptême non trouvé'], 404);
        }

        $nouveauStatut = $request->input('statut');
        $statutsPossibles = ['en_attente', 'transmis_secretaire', 'transmis_pretre', 'traite'];

        if (!in_array($nouveauStatut, $statutsPossibles)) {
            return response()->json(['message' => 'Statut invalide'], 400);
        }

        if (!$user || !$user->role) {
            return response()->json(['message' => 'Utilisateur ou rôle non défini'], 403);
        }

        $role = $user->role->name;

        if (
            ($role === 'secretaire' && $bapteme->statut === 'en_attente' && $nouveauStatut === 'transmis_secretaire') ||
            ($role === 'pretre' && $bapteme->statut === 'transmis_secretaire' && in_array($nouveauStatut, ['transmis_pretre', 'traite'])) ||
            ($role === 'admin')
        ) {
            $bapteme->statut = $nouveauStatut;
            $bapteme->save();

            return response()->json($bapteme);
        }

        return response()->json(['message' => 'Action non autorisée'], 403);
    }

    /**
     * Validation centralisée
     */
    private function validateBapteme(Request $request)
    {
        return $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'naissance' => 'required|date',
            'Datebapteme' => 'required|date',
            'AnneeBapteme' => 'required|integer|min:1900|max:' . date('Y'),
            'Confirme' => 'required|in:Oui,Non',
            'Marie' => 'required|in:Oui,Non',
            'NbrExemplaires' => 'required|integer|min:1',
            'Telephone' => 'required|string|max:20',
            'Email' => 'required|email|max:100',
        ]);
    }
}
