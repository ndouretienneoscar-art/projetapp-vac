import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TraitementPretre({ type, onUpdate }) {
  const [demandes, setDemandes] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setDemandes(response.data);
    })
    .catch(error => {
      console.error(`Erreur lors de la récupération des ${type} :`, error);
    });
  }, [type]);

  const changerStatut = (id, nouveauStatut) => {
    axios.post(`http://localhost:8000/api/${type}/${id}/changer-statut`, {
      statut: nouveauStatut
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setDemandes(prev => prev.filter(d => d.id !== id));
      setMessage(`✅ Statut changé en "${nouveauStatut}"`);
      if (onUpdate) onUpdate();

      setTimeout(() => setMessage(''), 3000); // 👈 efface le message après 3s
    })
    .catch(error => {
      console.error('Erreur lors du changement de statut :', error);
      setMessage('❌ Erreur lors du changement de statut');
      setTimeout(() => setMessage(''), 3000);
    });
  };

  const afficherInfo = (demande) => {
    const nom = demande.nom || demande.demandeur || demande.intention || 'Demande';
    const prenom = demande.prenom || '';
    const email = demande.Email || demande.telephone_demandeur || demande.Telephone || '';
    return `${nom} ${prenom} — ${email}`;
  };

  return (
    <div>
      <h4>Demandes à traiter : {type}</h4>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {demandes.length === 0 ? (
        <p>Aucune demande à traiter.</p>
      ) : (
        <ul>
          {demandes.map((demande) => (
            <li key={demande.id} style={{ marginBottom: '10px' }}>
              <strong>{afficherInfo(demande)}</strong>
              <button style={{ marginLeft: '10px' }} onClick={() => changerStatut(demande.id, 'traite')}>
                Marquer comme traitée
              </button>
              <button style={{ marginLeft: '10px' }} onClick={() => changerStatut(demande.id, 'transmis_pretre')}>
                Transmettre au prêtre
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TraitementPretre;
