import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ListeDemandes({ type }) {
  const [demandes, setDemandes] = useState([]);
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

  const transfererDemande = (id) => {
    axios.post(`http://localhost:8000/api/${type}/${id}/transfer`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      alert('Demande transférée au prêtre !');
      // Optionnel : recharger la liste
      setDemandes(prev => prev.filter(d => d.id !== id));
    })
    .catch(error => {
      console.error('Erreur lors du transfert :', error);
    });
  };

  return (
    <div>
      <h4>Demandes de {type}</h4>
      {demandes.length === 0 ? (
        <p>Aucune demande en attente.</p>
      ) : (
        <ul>
          {demandes.map((demande) => (
            <li key={demande.id} style={{ marginBottom: '10px' }}>
              <strong>{demande.nom} {demande.prenom}</strong> — {demande.Email}
              <button style={{ marginLeft: '10px' }} onClick={() => transfererDemande(demande.id)}>
                Transférer au prêtre
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListeDemandes;
