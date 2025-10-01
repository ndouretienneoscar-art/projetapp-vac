// DelivranceExtraits.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DelivranceExtraits = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f3f4', borderRadius: '8px' }}>
      <h2 style={{ color: '#2c3e50' }}>📄 Délivrance d'extraits sacramentels</h2>
      <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>
        Choisissez un sacrement pour remplir le formulaire et envoyer un extrait PDF au demandeur.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={() => navigate('/espace-pretre/bapteme')} style={btnStyle}>🕊️ Baptême</button>
        <button onClick={() => navigate('/espace-pretre/confirmation')} style={btnStyle}>🔥 Confirmation</button>
        <button onClick={() => navigate('/espace-pretre/mariage')} style={btnStyle}>💍 Mariage</button>
      </div>
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

export default DelivranceExtraits;
