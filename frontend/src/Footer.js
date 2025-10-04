// components/Footer.js
import React from 'react';
import './Footer.css'; // on va créer ce fichier juste après

const Footer = () => {
  return (
    <footer className="footer-fixe">
      <div className="footer-section">
        <p>Quartier Escal, Bambey, Sénégal-Diocèse de Thiès</p>
      </div>

      <div className="footer-section">
        <p><strong>📞 Contacts:   </strong><strong>Téléphone :</strong> +221 77 627 72 16    -    <strong>Email :</strong> paroissesaintecroixb@gmail.com</p>
      </div>

      <div className="footer-section">
        <p><em>✝️“Que la paix du Christ repose sur chaque visiteur de cette application. Amen.”</em></p>
      </div>

      <div className="footer-copy">
        &copy; {new Date().getFullYear()} Paroisse Sainte Croix de Bambey. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
