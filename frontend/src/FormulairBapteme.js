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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/delivrance/bapteme', formData);
    alert('📩 Certificat de baptême envoyé au demandeur !');
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>↩ Retour</button>

      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Demande de certificat de baptême</h2>
        <input name="nom" placeholder="Nom" required onChange={handleChange} />
        <input name="prenom" placeholder="Prénom(s)" required onChange={handleChange} />
        <input name="naissance" type="date" required onChange={handleChange} />
        <input name="Datebapteme" type="date" required onChange={handleChange} />
        <input name="AnneeBapteme" type="number" placeholder="Année de baptême" required onChange={handleChange} />
        <select name="Confirme" required onChange={handleChange}>
          <option value="">Confirmé(e) ?</option>
          <option value="Oui">Oui</option>
          <option value="Non">Non</option>
        </select>
        <select name="Marie" required onChange={handleChange}>
          <option value="">Marié(e) ?</option>
          <option value="Oui">Oui</option>
          <option value="Non">Non</option>
        </select>
        <button type="submit" style={submitButtonStyle}>📤 Demander</button>
      </form>
    </div>
  );
};

const containerStyle = {
  padding: '2rem',
  fontSize: '1.1rem',
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

export default FormulaireBapteme;
