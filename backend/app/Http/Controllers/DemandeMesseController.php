<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\DemandeMesse;

class DemandeMesseController extends Controller
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
            return DemandeMesse::where('user_id', $user->id)->get();
        }

        if ($role === 'secretaire') {
            return DemandeMesse::where('statut', 'en_attente')->get();
        }

        if ($role === 'pretre') {
            return DemandeMesse::where('statut', 'transmis_secretaire')->get();
        }

        return response()->json(['message' => 'Rôle non reconnu'], 403);
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

        $validated = $this->validateDemande($request);
        $validated['user_id'] = $user->id;
        $validated['statut'] = 'en_attente';

        $demande = DemandeMesse::create($validated);

        return response()->json([
            'message' => '🙏 Votre demande a été enregistrée avec foi. Elle sera traitée avec soin.',
            'demande' => $demande
        ], 201);
    }

    /**
     * Voir une demande spécifique
     */
    public function show($id)
    {
        $demande = DemandeMesse::find($id);

        if (!$demande) {
            return response()->json(['message' => 'Demande de messe non trouvée'], 404);
        }

        return response()->json($demande);
    }
    public function update(Request $request, $id)
    {
        $demande = DemandeMesse::find($id);

        if (!$demande) {
            return response()->json(['message' => 'Demande de messe non trouvée'], 404);
        }

        $validated = $this->validateDemande($request);

        $demande->update($validated);

        return response()->json($demande);
    }

    /**
     * Supprime une demande
     */
    public function destroy($id)
    {
        $demande = DemandeMesse::find($id);

        if (!$demande) {
            return response()->json(['message' => 'Demande de messe non trouvée'], 404);
        }

        $demande->delete();

        return response()->json(['message' => '🕊️ Demande de messe supprimée avec succès.']);
    }

    /**
     * Transfère une demande au prêtre
     */
    public function transferToPretre($id, Request $request)
    {
        $demande = DemandeMesse::find($id);

        if (!$demande) {
            return response()->json(['message' => 'Demande de messe non trouvée'], 404);
        }

        $demande->statut = 'transmis_secretaire';

        if ($request->filled('pretre_id')) {
            $demande->pretre_id = $request->input('pretre_id');
        }

        $demande->save();

        return response()->json([
            'message' => '📨 Demande transférée au prêtre avec foi.',
            'demande' => $demande
        ]);
    }

    /**
     * Change le statut d'une demande
     */
    public function changerStatut(Request $request, $id)
    {
        $user = Auth::user();
        $demande = DemandeMesse::find($id);

        if (!$demande) {
            return response()->json(['message' => 'Demande de messe non trouvée'], 404);
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
            ($role === 'secretaire' && $demande->statut === 'en_attente' && $nouveauStatut === 'transmis_secretaire') ||
            ($role === 'pretre' && $demande->statut === 'transmis_secretaire' && in_array($nouveauStatut, ['transmis_pretre', 'traite'])) ||
            ($role === 'admin')
        ) {
            $demande->statut = $nouveauStatut;
            $demande->save();

            return response()->json([
                'message' => '✅ Statut mis à jour avec succès.',
                'demande' => $demande
            ]);
        }

        return response()->json(['message' => 'Action non autorisée'], 403);
    }

    /**
     * Validation centralisée
     */
    private function validateDemande(Request $request)
    {
        return $request->validate([
            'type_messe' => 'required|string|max:100',
            'montant' => 'required|numeric|min:0',
            'intention' => 'required|string|max:255',
            'beneficiaire' => 'required|string|max:100',
            'date_messe' => 'required|date',
            'heure_messe' => 'required|string|max:10',
            'demandeur' => 'required|string|max:100',
            'telephone_demandeur' => 'required|string|max:20',
        ]);
    }
}
