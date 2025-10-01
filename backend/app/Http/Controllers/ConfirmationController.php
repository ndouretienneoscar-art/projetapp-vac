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
            return Confirmation::where('statut', 'transmis_secretaire')->get();
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
     * Transfère une demande au prêtre
     */
    public function transferToPretre($id, Request $request)
    {
        $confirmation = Confirmation::find($id);

        if (!$confirmation) {
            return response()->json(['message' => 'Confirmation non trouvée'], 404);
        }

        $confirmation->statut = 'transmis_secretaire';

        if ($request->filled('pretre_id')) {
            $confirmation->pretre_id = $request->input('pretre_id');
        }

        $confirmation->save();

        return response()->json([
            'message' => 'Demande transférée au prêtre',
            'confirmation' => $confirmation
        ]);
    }

    /**
     * Change le statut selon le rôle
     */
    public function changerStatut(Request $request, $id)
    {
        $user = Auth::user();
        $confirmation = Confirmation::find($id);

        if (!$confirmation) {
            return response()->json(['message' => 'Confirmation non trouvée'], 404);
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
            ($role === 'secretaire' && $confirmation->statut === 'en_attente' && $nouveauStatut === 'transmis_secretaire') ||
            ($role === 'pretre' && $confirmation->statut === 'transmis_secretaire' && in_array($nouveauStatut, ['transmis_pretre', 'traite'])) ||
            ($role === 'admin')
        ) {
            $confirmation->statut = $nouveauStatut;
            $confirmation->save();

            return response()->json($confirmation);
        }

        return response()->json(['message' => 'Action non autorisée'], 403);
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
