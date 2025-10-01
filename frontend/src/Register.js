import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Register({ onRegister }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!nom || !prenom || !email || !password || !passwordConfirm) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }
    if (password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }
    try {
      // Remplacer l'URL par celle de votre backend Laravel
      const response = await axios.post('http://localhost:8000/api/register', {
        name: nom,
        prenom: prenom,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
if (response.status === 201) {
  setNom('');
  setPrenom('');
  setEmail('');
  setPassword('');
  setPasswordConfirm('');
  setError('');
  alert('Inscription réussie !');
  if (onRegister) onRegister(response.data.user);
}

 else {
  setError('Erreur lors de l’inscription.');
}

    } catch (err) {
      setError('Erreur lors de l’inscription.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prénom(s) :</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmer le mot de passe :</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Inscription...' : 'S’inscrire'}
        </button>
      </form>
    </div>
  );
}

export default Register;
