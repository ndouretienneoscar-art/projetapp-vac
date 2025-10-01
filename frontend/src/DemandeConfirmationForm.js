import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function DemandeConfirmationForm({ onSuccess }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    DateConfirmation: '',
    LieuConfirmation: '',
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
  if (!token) {
    setError("Utilisateur non authentifié.");
    setLoading(false);
    return;
  }

  const response = await axios.post('http://localhost:8000/api/confirmations', form, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 201) {
    if (onSuccess) onSuccess();
    setForm({ nom: '', prenom: '', DateConfirmation: '', LieuConfirmation: '', NbrExemplaires: 1, Telephone: '', Email: '' });
  }
} catch (err) {
  console.error('Erreur complète :', err);
  const messages = Object.values(err.response?.data?.errors || {}).flat();
  const fallback = err.response?.data?.message || 'Erreur lors de la soumission.';
  setError(messages.join(' | ') || fallback);
}



    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Attestation de Confirmation</h2>
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
          <label>Date de confirmation :</label>
          <input type="date" name="DateConfirmation" value={form.DateConfirmation} onChange={handleChange} required />
        </div>
        <div>
          <label>Lieu de confirmation :</label>
          <input type="text" name="LieuConfirmation" value={form.LieuConfirmation} onChange={handleChange} required />
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

export default DemandeConfirmationForm;
