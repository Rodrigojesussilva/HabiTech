// src/components/Header.tsx
import React from 'react';
import './Header.css';
import prediosImage from '../assets/predios.jpeg';
import psp from '../assets/psp.jpeg';

const Header: React.FC = () => {
  return (
    <header className="header">
      <img 
        src={prediosImage} // Usando a imagem grande importada
        alt="Edifícios"
        className="header-image-large"
      />
      <img 
        src={psp} // Substitua pelo caminho da imagem pequena
        alt="Imagem pequena"
        className="header-image-small"
      />
    </header>
  );
};

export default Header;
