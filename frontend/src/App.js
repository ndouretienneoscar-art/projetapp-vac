import './App.css';
import Login from './Login';
import Register from './Register';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EspaceUtilisateur from './EspaceUtilisateur';
import EspaceSecretaire from './EspaceSecretaire';
import EspacePretre from './EspacePretre';
import FormulaireBapteme from './FormulaireBapteme';
import FormulaireConfirmation from './FormulaireConfirmation';
import FormulaireMariage from './FormulaireMariage';
import MediaSection from './MediaSection';
import Footer from './Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [afficherDemandesPretre, setAfficherDemandesPretre] = useState(false);
  const [nombreDemandes, setNombreDemandes] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const savedChoice = localStorage.getItem('showRegister');
    setShowRegister(savedChoice === 'true');

    if (token) {
      axios.get('http://localhost:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
        const role = response.data.role?.name?.toLowerCase();
        if (role === 'pretre') fetchNombreDemandes();
      })
      .catch(() => setIsAuthenticated(false));
    }
  }, []);

  const fetchNombreDemandes = async () => {
    const token = localStorage.getItem('token');
    try {
      const types = ['baptemes', 'mariages', 'confirmations', 'demandemesses'];
      let total = 0;
      for (const type of types) {
        const response = await axios.get(`http://localhost:8000/api/${type}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        total += Array.isArray(response.data) ? response.data.length : 0;
      }
      setNombreDemandes(total);
    } catch (error) {
      console.error('Erreur lors du comptage des demandes :', error);
    }
  };

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUser(response.data);
      const role = response.data.role?.name?.toLowerCase();
      if (role === 'pretre') fetchNombreDemandes();
      setIsAuthenticated(true);
    })
    .catch(() => setIsAuthenticated(false));
  };

  const handleRegister = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setUser(response.data);
      setIsAuthenticated(true);
    })
    .catch(() => setIsAuthenticated(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('showRegister');
    setIsAuthenticated(false);
    setUser(null);
    setShowRegister(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    localStorage.setItem('showRegister', 'true');
  };

  const handleShowLogin = () => {
    setShowRegister(false);
    localStorage.setItem('showRegister', 'false');
  };

  const role = user?.role?.name?.toLowerCase();

  return (
    <Router>
          <MediaSection /> {/* Le logo s'affichera en haut de toutes les pages */}
      <Routes>
        <Route path="/espace-pretre/bapteme" element={<FormulaireBapteme />} />
        <Route path="/espace-pretre/confirmation" element={<FormulaireConfirmation />} />
        <Route path="/espace-pretre/mariage" element={<FormulaireMariage />} />
        <Route
          path="/"
          
          element={
            <div className="app-padding">

              {isAuthenticated ? (
                <div className="dashboard">
                  <h2
                    style={{
                      color:
                        role === 'demandeur'
                          ? '#00d5ff'
                          : role === 'secretaire'
                          ? '#174ab8ff'
                          : role === 'pretre'
                          ? '#c142ae'
                          : '#333',
                          textAlign: 'center', marginBottom: '20px',
                    }}
                  >
                    {role === 'demandeur' && '👤 ESPACE CLIENT'}
                    {role === 'secretaire' && '🗂️ ESPACE SECRÉTAIRE'}
                    {role === 'pretre' && '✝️ ESPACE PRÊTRE'}
                  </h2>

                  <div className="message-bienvenue animated">
                    <p className="salutation">
                      ✝️ <strong>Bienvenue {user?.prenom} !</strong>
                    </p>
                    <p>
                      Que la Grâce et la Paix de Jésus-Christ vous accompagne dans chaque démarche. Amen.
                    </p>

                  </div>

                  <div className="boutons-actions" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px' }}>
                    <button className="bouton-deconnexion" onClick={handleLogout}>Déconnexion</button>
                    <button className="bouton-theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                      {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
                    </button>
                  </div>

                  {role === 'demandeur' && (
                    <EspaceUtilisateur
                      user={user}
                      nombreDemandes={nombreDemandes}
                      afficherDemandesPretre={afficherDemandesPretre}
                      setAfficherDemandesPretre={setAfficherDemandesPretre}
                      fetchNombreDemandes={fetchNombreDemandes}
                    />
                  )}
                  {role === 'secretaire' && <EspaceSecretaire currentUser={user} />}
                  {role === 'pretre' && <EspacePretre currentUser={user} />}
                </div>
              ) : (
                <div className="form-container">
                  <div className={showRegister ? 'fade-out' : 'fade-in'}>
                    <Login onLogin={handleLogin} />
                    <button style={{ marginTop: 10 }} onClick={handleShowRegister}>
                      Pas encore de compte ? S'inscrire
                    </button>
                  </div>
                  <div className={showRegister ? 'fade-in' : 'fade-out'}>
                    <Register onRegister={handleRegister} />
                    <button style={{ marginTop: 10 }} onClick={handleShowLogin}>
                      Déjà inscrit ? Se connecter
                    </button>
                  </div>
                </div>
              )}
              <Footer /> {/* Le footer s'affichera en bas de toutes les pages */}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
