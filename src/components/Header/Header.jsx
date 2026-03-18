import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/header-logo.png';
import './header.css';

export default function Header({ className = '' }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const handleMenuClose = () => setMenuAberto(false);

  return (
    <header className={`header ${className}`.trim()}>
      {/* LOGO E TEXTO */}
      <Link 
        to="/introducao" 
        className="header-logo-link"
      >
        <div className="header-logo-area">
          <img src={logo} alt="Chá de Panela Logo" className="header-logo" />
          <p className="header-logo-text">Estella & Lucas</p>
        </div>
      </Link>

      {/* BOTÃO MENU MOBILE */}
      <button
        className={`header-menu-toggle ${menuAberto ? 'active' : ''}`}
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Toggle menu"
        aria-expanded={menuAberto}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MENU NAVEGAÇÃO */}
      <nav className={`header-menu ${menuAberto ? 'open' : ''}`}>
        <Link 
          to="/confirmacao" 
          onClick={handleMenuClose}
        >
          Confirmar presença
        </Link>
        <Link 
          to="/presentes" 
          onClick={handleMenuClose}
        >
          Lista de presentes
        </Link>
        <Link 
          to="/area-convidado" 
          onClick={handleMenuClose}
        >
          Área do convidado
        </Link>
      </nav>
    </header>
  );
}
