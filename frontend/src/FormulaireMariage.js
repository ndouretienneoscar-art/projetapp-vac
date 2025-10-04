import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormulaireMariage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    DateMariage: '',
    AvecQui: '',
    LieuMariage: '',
    Telephone: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/delivrance/mariage', formData);
    setMessage("💍 Que cette attestation soit le reflet de votre union sacrée. Que Dieu bénisse votre foyer.");
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>↩ Retour</button>

      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}> Attestation de mariage</h2>

        <label htmlFor="nom" style={labelStyle}>Nom</label>
        <input id="nom" name="nom" required onChange={handleChange} />

        <label htmlFor="prenom" style={labelStyle}>Prénom(s)</label>
        <input id="prenom" name="prenom" required onChange={handleChange} />

        <label htmlFor="DateMariage" style={labelStyle}>Date du mariage</label>
        <input id="DateMariage" name="DateMariage" type="date" required onChange={handleChange} />

        <label htmlFor="AvecQui" style={labelStyle}>Nom du conjoint(e)</label>
        <input id="AvecQui" name="AvecQui" required onChange={handleChange} />

        <label htmlFor="LieuMariage" style={labelStyle}>Lieu du mariage</label>
        <input id="LieuMariage" name="LieuMariage" required onChange={handleChange} />

        <label htmlFor="Telephone" style={labelStyle}>Téléphone</label>
        <input id="Telephone" name="Telephone" type="tel" required onChange={handleChange} />

        <button type="submit" style={submitButtonStyle}>📤 Délivrer</button>
      </form>

      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default FormulaireMariage;

// Styles partagés
const containerStyle = {
  padding: '2rem',
  fontSize: '1.2rem',
  fontFamily: 'Segoe UI, sans-serif',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  maxWidth: '600px',
  margin: 'auto',
  padding: '2rem',
  backgroundColor: '#f8fcfa',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
};

const titleStyle = {
  textAlign: 'center',
  color: '#d32f2f',
  marginBottom: '1rem',
  fontSize: '1.6rem',
};

const labelStyle = {
  fontSize: '0.95rem',
  color: '#555',
  marginBottom: '-0.5rem',
  marginTop: '0.5rem',
  fontWeight: '500',
};

const backButtonStyle = {
  marginBottom: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#34495e',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const submitButtonStyle = {
  padding: '0.7rem 1.2rem',
  backgroundColor: '#8e44ad',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const messageStyle = {
  marginTop: '2rem',
  textAlign: 'center',
  fontSize: '1.2rem',
  color: '#2c3e50',
  fontStyle: 'italic',
  animation: 'fadeIn 1s ease-in-out',
};
