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
            return Mariage::where('statut', 'transmis_secretaire')->get();
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
     * Transfère une demande au prêtre
     */
    public function transferToPretre($id, Request $request)
    {
        $mariage = Mariage::find($id);

        if (!$mariage) {
            return response()->json(['message' => 'Mariage non trouvé'], 404);
        }

        $mariage->statut = 'transmis_secretaire';

        if ($request->filled('pretre_id')) {
            $mariage->pretre_id = $request->input('pretre_id');
        }

        $mariage->save();

        return response()->json(['message' => 'Demande de mariage transférée au prêtre', 'mariage' => $mariage]);
    }

    /**
     * Change le statut selon le rôle
     */
    public function changerStatut(Request $request, $id)
    {
        $user = Auth::user();
        $mariage = Mariage::find($id);

        if (!$mariage) {
            return response()->json(['message' => 'Mariage non trouvé'], 404);
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
            ($role === 'secretaire' && $mariage->statut === 'en_attente' && $nouveauStatut === 'transmis_secretaire') ||
            ($role === 'pretre' && $mariage->statut === 'transmis_secretaire' && in_array($nouveauStatut, ['transmis_pretre', 'traite'])) ||
            ($role === 'admin')
        ) {
            $mariage->statut = $nouveauStatut;
            $mariage->save();

            return response()->json($mariage);
        }

        return response()->json(['message' => 'Action non autorisée'], 403);
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
