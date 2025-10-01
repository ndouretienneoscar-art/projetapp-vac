import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import './Form.css';


function DemandeBaptemeForm({ onSuccess }) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    naissance: '',
    Datebapteme: '',
    AnneeBapteme: '',
    Confirme: '',
    Marie: '',
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
    // Validation simple
    for (const key in form) {
      if (!form[key]) {
        setError('Veuillez remplir tous les champs.');
        setLoading(false);
        return;
      }
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/baptemes', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201) {
        if (onSuccess) onSuccess();
        setForm({
          nom: '', prenom: '', naissance: '', Datebapteme: '', AnneeBapteme: '', Confirme: '', Marie: '', NbrExemplaires: 1, Telephone: '', Email: ''
        });
      }
    } catch (err) {
      setError('Erreur lors de la soumission.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Certificat de Baptême</h2>
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
          <label>Date de naissance :</label>
          <input type="date" name="naissance" value={form.naissance} onChange={handleChange} required />
        </div>
        <div>
          <label>Date de baptême :</label>
          <input type="date" name="Datebapteme" value={form.Datebapteme} onChange={handleChange} required />
        </div>
        <div>
          <label>Année de baptême :</label>
          <input type="number" name="AnneeBapteme" value={form.AnneeBapteme} onChange={handleChange} min="1900" max={new Date().getFullYear()} required />
        </div>
        <div>
          <label>Confirmé(e) :</label>
          <select name="Confirme" value={form.Confirme} onChange={handleChange} required>
            <option value="">Choisir</option>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
        </div>
        <div>
          <label>Marié(e) :</label>
          <select name="Marie" value={form.Marie} onChange={handleChange} required>
            <option value="">Choisir</option>
            <option value="Oui">Oui</option>
            <option value="Non">Non</option>
          </select>
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

export default DemandeBaptemeForm;
