import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EspaceSecretaire = ({ currentUser }) => {
  const [demandes, setDemandes] = useState([]);
  const [filtre, setFiltre] = useState('attente'); // 'attente' ou 'autres'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isSecretaire = currentUser?.role?.name === 'secretaire';

  useEffect(() => {
    if (isSecretaire) {
      const fetchDemandes = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/api/demandemesses', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDemandes(response.data);
          console.log('Demandes reçues :', response.data);
        } catch (error) {
          console.error('Erreur lors du chargement des demandes de messes :', error);
        }
      };
      fetchDemandes();
    }
  }, [isSecretaire]);

  const updateStatut = async (id, statut) => {
    try {
      await axios.put(`/api/demandemesses/${id}/statut`, { statut });
      setDemandes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, statut } : d))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
    }
  };

  const updatePaiement = async (id, moyen) => {
    try {
      await axios.put(`/api/demandemesses/${id}/paiement`, { moyen });
      setDemandes((prev) =>
        prev.map((d) => (d.id === id ? { ...d, paiement: moyen } : d))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement :', error);
    }
  };

  const demandesFiltrées = demandes
    .filter((d) =>
      filtre === 'attente' ? d.statut === 'en_attente' : d.statut !== 'en_attente'
    )
    .filter((d) =>
      d.demandeur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.intention?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(demandesFiltrées.length / itemsPerPage);
  const demandesPaginées = demandesFiltrées.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!isSecretaire) {
    return (
      <div style={{ color: 'red', padding: '1rem' }}>
        ⛔ Accès refusé. Seuls les secrétaires peuvent accéder à cet espace.
      </div>
    );
  }

  return (
    <div className="espace-secretaire" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2c3e50' }}>
        🎯 Gestion des demandes de messes
      </h1>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => {
            setFiltre('attente');
            setCurrentPage(1);
          }}
          style={{
            marginRight: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🔵 En attente
        </button>
        <button
          onClick={() => {
            setFiltre('autres');
            setCurrentPage(1);
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🟢 Autres demandes
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Rechercher par nom ou intention"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '100%',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />

      <table
        border="1"
        cellPadding="10"
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#ecf0f1',
        }}
      >
        <thead style={{ backgroundColor: '#bdc3c7' }}>
          <tr>
            <th>ID</th>
            <th>Type Messe</th>
            <th>Montant</th>
            <th>Intention</th>
            <th>Bénéficiaire</th>
            <th>Date Messe</th>
            <th>Heure Messe</th>
            <th>Demandeur</th>
            <th>Téléphone</th>
            <th>Paiement</th>
            <th>Statut</th>
            <th>Créée le</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {demandesPaginées.map((demande) => (
           <tr key={demande.id}>
  <td>{demande.id}</td>
  <td>{demande.type_messe || '—'}</td>
  <td>{demande.montant || '—'}</td>
  <td>{demande.intention || '—'}</td>
  <td>{demande.beneficiaire || '—'}</td>
  <td>{demande.date_messe || '—'}</td>
  <td>{demande.heure_messe || '—'}</td>
  <td>{demande.demandeur || '—'}</td>
  <td>{demande.telephone_demandeur || '—'}</td>
  <td>
    <select
      value={demande.paiement || ''}
      onChange={(e) => updatePaiement(demande.id, e.target.value)}
    >
      <option value="">--Choisir--</option>
      <option value="wave">Wave</option>
      <option value="orange_money">Orange Money</option>
    </select>
  </td>
  <td>
    <select
      value={demande.statut || ''}
      onChange={(e) => updateStatut(demande.id, e.target.value)}
    >
      <option value="en_attente">En attente</option>
      <option value="traitée">Traitée</option>
    </select>
  </td>
  <td>{new Date(demande.created_at).toLocaleString('fr-FR')}</td>
  <td>
    <button
      onClick={() => console.log('Voir détails', demande.id)}
      style={{
        padding: '0.3rem 0.6rem',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
      }}
    >
      👁️ Voir
    </button>
  </td>
</tr>

          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            marginRight: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          ◀ Précédent
        </button>
        <span style={{ fontWeight: 'bold' }}>
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Suivant ▶
        </button>
      </div>
    </div>
  );
};

export default EspaceSecretaire;
