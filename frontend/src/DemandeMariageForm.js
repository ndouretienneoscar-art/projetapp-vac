import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function DemandeMariageForm({ onSuccess }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    DateMariage: '',
    AvecQui: '',
    LieuMariage: '',
    NbrExemplaires: 1,
    Telephone: '',
    Email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    for (const key in form) {
      if (!form[key]) {
        setError('Veuillez remplir tous les champs.');
        setLoading(false);
        return;
      }
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/mariages', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201) {
        if (onSuccess) onSuccess();
        setForm({ nom: '', prenom: '', DateMariage: '', AvecQui: '', LieuMariage: '', NbrExemplaires: 1, Telephone: '', Email: '' });
      }
    } catch (err) {
      setError('Erreur lors de la soumission.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Attestation de Mariage</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input type="text" name="nom" value={form.nom} onChange={handleChange} required />
        </div>
        <div>
          <label>Prénom(s) :</label>
          <input type="text" name="prenom" value={form.prenom} onChange={handleChange} required />
        </div>
        <div>
          <label>Date du mariage :</label>
          <input type="date" name="DateMariage" value={form.DateMariage} onChange={handleChange} required />
        </div>
        <div>
          <label>Avec qui :</label>
          <input type="text" name="AvecQui" value={form.AvecQui} onChange={handleChange} required />
        </div>
        <div>
          <label>Lieu du mariage :</label>
          <input type="text" name="LieuMariage" value={form.LieuMariage} onChange={handleChange} required />
        </div>
        <div>
          <label>Nombre d'exemplaires :</label>
          <input type="number" name="NbrExemplaires" value={form.NbrExemplaires} onChange={handleChange} min="1" required />
        </div>
        <div>
          <label>Téléphone :</label>
          <input type="text" name="Telephone" value={form.Telephone} onChange={handleChange} required />
        </div>
        <div>
          <label>Email :</label>
          <input type="email" name="Email" value={form.Email} onChange={handleChange} required />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>
      </form>
    </div>
  );
}

export default DemandeMariageForm;
