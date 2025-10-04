import React, { useState } from 'react';
import DemandeBaptemeForm from './DemandeBaptemeForm';
import DemandeMariageForm from './DemandeMariageForm';
import DemandeConfirmationForm from './DemandeConfirmationForm';
import DemandeMesseForm from './DemandeMesseForm';

function EspaceUtilisateur({ user }) {
  const role = user?.role?.name?.toLowerCase();
  const [formulaireActif, setFormulaireActif] = useState(null);

  if (role !== 'demandeur') return null;

  // Fonction toggle
  const toggleFormulaire = (type) => {
    setFormulaireActif((prev) => (prev === type ? null : type));
  };

  return (
    <div className="espace-demandeur">
      <nav className="nav-formulaires">
        <button onClick={() => toggleFormulaire('bapteme')}>🍼 Baptême</button>
        <button onClick={() => toggleFormulaire('mariage')}>💍 Mariage</button>
        <button onClick={() => toggleFormulaire('confirmation')}>🕊️ Confirmation</button>
        <button onClick={() => toggleFormulaire('messe')}>⛪ Messe</button>
      </nav>

      <div className="zone-formulaire">
        {formulaireActif === 'bapteme' && (
          <DemandeBaptemeForm onSuccess={() => alert('Demande envoyée !')} />
        )}
        {formulaireActif === 'mariage' && (
          <DemandeMariageForm onSuccess={() => alert('Demande envoyée !')} />
        )}
        {formulaireActif === 'confirmation' && (
          <DemandeConfirmationForm onSuccess={() => alert('Demande envoyée !')} />
        )}
        {formulaireActif === 'messe' && (
          <DemandeMesseForm onSuccess={() => alert('Demande envoyée !')} />
        )}
      </div>
    </div>
  );
}

export default EspaceUtilisateur;
