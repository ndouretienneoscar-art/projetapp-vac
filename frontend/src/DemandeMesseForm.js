import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function DemandeMesseForm({ onSuccess }) {
  const [form, setForm] = useState({
    type_messe: '',
    montant: '',
    intention: '',
    beneficiaire: '',
    date_messe: '',
    heure_messe: '',
    demandeur: '',
    telephone_demandeur: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

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
      const response = await axios.post('http://localhost:8000/api/demandemesses', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        if (onSuccess) onSuccess();
        setForm({
          type_messe: '',
          montant: '',
          intention: '',
          beneficiaire: '',
          date_messe: '',
          heure_messe: '',
          demandeur: '',
          telephone_demandeur: '',
        });
        alert('Demande envoyée et enregistrée avec succès !');
      }
    } catch (err) {
  console.error('Erreur complète :', err);
  const messages = Object.values(err.response?.data?.errors || {}).flat();
  setError(messages.length ? messages.join(' | ') : err.response?.data?.message || 'Erreur lors de la soumission.');
}


    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Demande de Messe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type de messe :</label>
          <select name="type_messe" value={form.type_messe} onChange={handleChange} required>
            <option value="">Choisir</option>
            <option value="requiem">Requiem</option>
            <option value="simple">Simple</option>
            <option value="neuvaine">Neuvaine</option>
            <option value="trentaine">Trentaine</option>
          </select>
        </div>
        <div>
          <label>Montant :</label>
          <input type="text" name="montant" value={form.montant} onChange={handleChange} required />
        </div>
        <div>
          <label>Intention :</label>
          <input type="text" name="intention" value={form.intention} onChange={handleChange} required />
        </div>
        <div>
          <label>Bénéficiaire :</label>
          <input type="text" name="beneficiaire" value={form.beneficiaire} onChange={handleChange} required />
        </div>
        <div>
          <label>Date de la messe :</label>
          <input type="date" name="date_messe" value={form.date_messe} onChange={handleChange} required />
        </div>
        <div>
          <label>Heure de la messe :</label>
          <input type="time" name="heure_messe" value={form.heure_messe} onChange={handleChange} required />
        </div>
        <div>
          <label>Demandeur :</label>
          <input type="text" name="demandeur" value={form.demandeur} onChange={handleChange} required />
        </div>
        <div>
          <label>Téléphone du demandeur :</label>
          <input type="text" name="telephone_demandeur" value={form.telephone_demandeur} onChange={handleChange} required />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>
      </form>
    </div>
  );
}

export default DemandeMesseForm;
