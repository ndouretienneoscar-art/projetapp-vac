import React, { useState } from 'react';
import DemandeBaptemeForm from './DemandeBaptemeForm';
import DemandeMariageForm from './DemandeMariageForm';
import DemandeConfirmationForm from './DemandeConfirmationForm';
import DemandeMesseForm from './DemandeMesseForm';

function EspaceUtilisateur({ user }) {
  const role = user?.role?.name?.toLowerCase();
  const [formulaireActif, setFormulaireActif] = useState(null);

  if (role !== 'demandeur') return null;

  return (
    <div className="espace-demandeur">
      <nav className="nav-formulaires">
        <button onClick={() => setFormulaireActif('bapteme')}>🍼 Baptême</button>
        <button onClick={() => setFormulaireActif('mariage')}>💍 Mariage</button>
        <button onClick={() => setFormulaireActif('confirmation')}>🕊️ Confirmation</button>
        <button onClick={() => setFormulaireActif('messe')}>⛪ Messe</button>
      </nav>

      <div className="zone-formulaire">
        {formulaireActif === 'bapteme' && <DemandeBaptemeForm onSuccess={() => alert('Demande envoyée !')} />}
        {formulaireActif === 'mariage' && <DemandeMariageForm onSuccess={() => alert('Demande envoyée !')} />}
        {formulaireActif === 'confirmation' && <DemandeConfirmationForm onSuccess={() => alert('Demande envoyée !')} />}
        {formulaireActif === 'messe' && <DemandeMesseForm onSuccess={() => alert('Demande envoyée !')} />}
      </div>
    </div>
  );
}

export default EspaceUtilisateur;
