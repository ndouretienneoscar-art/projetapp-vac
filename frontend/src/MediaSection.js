import React from 'react';
import logo from './assets/logo.jpg';
import './MediaSection.css'; // Ajoute ce fichier CSS

const MediaSection = () => {
  return (
    <div className="media-container">
      <img src={logo} alt="Logo Paroisse Sainte Croix de Bambey" className="media-logo" />
      <p className="media-phrase">
        “Que la lumière du Christ illumine chaque page de cette application.”
      </p>
      <h2 className="media-titre">Paroisse Sainte Croix de Bambey</h2>
    </div>
  );
};

export default MediaSection;
