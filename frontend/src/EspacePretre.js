import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EspacePretre = ({ currentUser }) => {
  const [baptemes, setBaptemes] = useState([]);
  const [confirmations, setConfirmations] = useState([]);
  const [messes, setMesses] = useState([]);
  const [mariages, setMariages] = useState([]);
  const [showTables, setShowTables] = useState(false);
  const [afficherTout, setAfficherTout] = useState(false);
  const [filtreNom, setFiltreNom] = useState('');
  const [filtreDate, setFiltreDate] = useState('');

  const [pages, setPages] = useState({
    baptemes: 1,
    confirmations: 1,
    messes: 1,
    mariages: 1,
  });

  const itemsPerPage = 5;
  const isPretre = currentUser?.role?.name === 'pretre';

  useEffect(() => {
    if (isPretre && showTables) {
      const fetchAll = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
          const [resBaptemes, resConfirmations, resMesses, resMariages] = await Promise.all([
            axios.get('/api/baptemes', { headers }),
            axios.get('/api/confirmations', { headers }),
            axios.get('/api/demandemesses', { headers }),
            axios.get('/api/mariages', { headers }),
          ]);

          const filter = (data) =>
            afficherTout ? data : data.filter((d) => d.statut === 'en_attente');

          setBaptemes(filter(resBaptemes.data));
          setConfirmations(filter(resConfirmations.data));
          setMesses(filter(resMesses.data));
          setMariages(filter(resMariages.data));
        } catch (error) {
          console.error('Erreur lors du chargement des demandes :', error);
        }
      };

      fetchAll();
    }
  }, [isPretre, showTables, afficherTout]);

  const updateStatut = async (type, id, statut) => {
    try {
      await axios.put(`/api/${type}/${id}/statut`, { statut });

      const setterMap = {
        baptemes: setBaptemes,
        confirmations: setConfirmations,
        demandemesses: setMesses,
        mariages: setMariages,
      };

      const currentList = {
        baptemes,
        confirmations,
        demandemesses: messes,
        mariages,
      }[type];

      setterMap[type](currentList.map((d) => (d.id === id ? { ...d, statut } : d)));
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut pour ${type} :`, error);
    }
  };

  const handlePageChange = (type, direction, totalItems) => {
    setPages((prev) => {
      const maxPage = Math.ceil(totalItems / itemsPerPage);
      const newPage =
        direction === 'next'
          ? Math.min(prev[type] + 1, maxPage)
          : Math.max(prev[type] - 1, 1);
      return { ...prev, [type]: newPage };
    });
  };

  const DelivranceExtraits = () => {
    const navigate = (path) => {
      window.location.href = path;
    };

    return (
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f3f4', borderRadius: '8px' }}>
        <h2 style={{ color: '#2c3e50' }}>📄 Délivrance d'extraits sacramentels</h2>
        <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>
          Choisissez un sacrement pour remplir le formulaire et envoyer un extrait PDF au demandeur.
        </p>
<div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
  <button onClick={() => navigate('/espace-pretre/bapteme')} style={btnStyle}>🕊️ Baptême</button>
  <button onClick={() => navigate('/espace-pretre/confirmation')} style={btnStyle}>🔥 Confirmation</button>
  <button onClick={() => navigate('/espace-pretre/mariage')} style={btnStyle}>💍 Mariage</button>
</div>
<hr style={{ margin: '2rem 0', borderTop: '1px solid #ccc' }} />

      </div>
    );
  };

  const btnStyle = {
    padding: '0.7rem 1.2rem',
    backgroundColor: '#8e44ad',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  if (!isPretre) {
    return (
      <div style={{ color: 'red', padding: '1rem' }}>
        ⛔ Accès refusé. Seuls les prêtres peuvent accéder à cet espace.
      </div>
    );
  }

  const renderTable = (title, data, type, columns) => {
    const filteredData = data.filter((demande) => {
      const nomMatch =
        filtreNom === '' ||
        Object.values(demande).some(
          (val) => typeof val === 'string' && val.toLowerCase().includes(filtreNom)
        );
      const dateMatch =
        filtreDate === '' ||
        Object.values(demande).some(
          (val) => typeof val === 'string' && val.includes(filtreDate)
        );
      return nomMatch && dateMatch;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentPage = pages[type];
    const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: '#8e44ad' }}>{title}</h2>
        <table
          border="1"
          cellPadding="10"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fdfefe',
          }}
        >
          <thead style={{ backgroundColor: '#dcdde1' }}>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th>Statut</th>
              <th>Action</th>
              
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} style={{ textAlign: 'center', fontStyle: 'italic', color: '#555' }}>
                  🙏 Aucune demande trouvée selon les critères. Que la paix du Seigneur vous guide.
                </td>
              </tr>
            )}
            {paginatedData.map((demande) => (
              <tr key={demande.id}>
                {columns.map((col) => (
                  <td key={col}>{demande[col]}</td>
                ))}
                <td>
                  <select
                    value={demande.statut}
                    onChange={(e) => updateStatut(type, demande.id, e.target.value)}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="traitée">Traitée</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => console.log('Voir détails', demande.id)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      backgroundColor: '#27ae60',
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

        {filteredData.length > itemsPerPage && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={() => handlePageChange(type, 'prev', filteredData.length)}
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
              onClick={() => handlePageChange(type, 'next', filteredData.length)}
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
        )}
      </div>
    );
  };

  return (
    <div className="espace-pretre" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2c3e50' }}>
        {afficherTout ? 'Toutes les demandes enregistrées' : 'Demandes en attente uniquement'}
        <button
          onClick={() => setShowTables((prev) => !prev)}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#8e44ad',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {showTables ? 'Masquer' : 'Voir et Traiter les demandes'}
        </button>
        {showTables && (
          <button
            onClick={() => setAfficherTout((prev) => !prev)}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#34495e',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {afficherTout ? 'Afficher uniquement les en attente' : 'Afficher toutes les demandes'}
          </button>
        )}
      </h1>

      {showTables && (
        <>
          <DelivranceExtraits />

          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="🔍 Rechercher par nom"
              value={filtreNom}
              onChange={(e) => setFiltreNom(e.target.value.toLowerCase())}
              style={{ marginRight: '1rem', padding: '0.5rem' }}
            />
            <input
              type="date"
              value={filtreDate}
              onChange={(e) => setFiltreDate(e.target.value)}
              style={{ padding: '0.5rem' }}
            />
          </div>

          {renderTable('Demandes de Baptême', baptemes, 'baptemes', [
            'id', 'nom', 'prenom', 'naissance', 'DateBapteme', 'AnneeBapteme', 'Confirme', 'Marie','NbrExemplaires',
            'Telephone', 'Email', 'created_at'
          ])}

          {renderTable('Demandes de Confirmation', confirmations, 'confirmations', [
            'id', 'nom', 'prenom', 'DateConfirmation', 'LieuConfirmation', 'NbrExemplaires',
            'Telephone', 'Email', 'created_at'
          ])}

          {renderTable('Demandes de Messe', messes, 'demandemesses', [
            'id', 'type_messe', 'montant', 'intention', 'beneficiaire', 'date_messe',
            'heure_messe', 'demandeur', 'telephone_demandeur', 'created_at'
          ])}

          {renderTable('Demandes de Mariage', mariages, 'mariages', [
            'id', 'nom', 'prenom', 'DateMariage', 'AvecQui','LieuMariage', 'NbrExemplaires',
            'Telephone', 'Email', 'created_at'
          ])}
        </>
      )}
    </div>
  );
};

export default EspacePretre;
