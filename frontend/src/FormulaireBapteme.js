import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormulaireBapteme = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    naissance: '',
    Datebapteme: '',
    AnneeBapteme: '',
    Confirme: '',
    Marie: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/delivrance/bapteme', formData);
    setMessage("🙏 Que ce certificat soit le témoignage vivant de votre foi. Que la lumière du Christ vous guide chaque jour.");
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>↩ Retour</button>

      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Demande de certificat de baptême</h2>

        <label htmlFor="nom" style={labelStyle}>Nom</label>
        <input id="nom" name="nom" required onChange={handleChange} />

        <label htmlFor="prenom" style={labelStyle}>Prénom(s)</label>
        <input id="prenom" name="prenom" required onChange={handleChange} />

        <label htmlFor="naissance" style={labelStyle}>Date de naissance</label>
        <input id="naissance" name="naissance" type="date" required onChange={handleChange} />

        <label htmlFor="Datebapteme" style={labelStyle}>Date de baptême</label>
        <input id="Datebapteme" name="Datebapteme" type="date" required onChange={handleChange} />

        <label htmlFor="AnneeBapteme" style={labelStyle}>Année de baptême</label>
        <input id="AnneeBapteme" name="AnneeBapteme" type="number" required onChange={handleChange} />

        <label htmlFor="Confirme" style={labelStyle}>Confirmé(e) ?</label>
        <select id="Confirme" name="Confirme" required onChange={handleChange}>
          <option value="">--Choisir--</option>
          <option value="Oui">Oui</option>
          <option value="Non">Non</option>
        </select>

        <label htmlFor="Marie" style={labelStyle}>Marié(e) ?</label>
        <select id="Marie" name="Marie" required onChange={handleChange}>
          <option value="">--Choisir--</option>
          <option value="Oui">Oui</option>
          <option value="Non">Non</option>
        </select>

        <button type="submit" style={submitButtonStyle}>📤 Demander</button>
      </form>

      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default FormulaireBapteme;

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
