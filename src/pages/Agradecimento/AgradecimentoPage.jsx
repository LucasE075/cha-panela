import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGuest } from '@/context';

import logo from '@/assets/images/header-logo.png';
import btnPresentes from '@/assets/images/btn-presentes.png';

import './agradecimento.css';

export default function AgradecimentoPage() {
  const { guest } = useGuest();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Determinar a mensagem com base na presença
  const mensagem =
    guest?.confirmou_presenca === true
      ? 'Obrigada por confirmar sua presença! Que alegria poder compartilhar esse momento especial com você. Nos vemos no nosso Chá de Panela!'
      : 'Obrigada por confirmar sua presença! Que pena, sentiremos sua falta no nosso Chá de Panela, mas esperamos nos encontrar em breve.';

  return (
    <div className="agradecimento-page">
      {/* HEADER */}
      <header className="agradecimento-header">
        <Link to="/introducao" style={{textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0}}>
          <div className="agradecimento-logo-area">
            <img src={logo} alt="logo" className="agradecimento-logo" />
            <p className="agradecimento-logo-text">Estella & Lucas</p>
          </div>
        </Link>

        <button
          className={`agradecimento-menu-toggle ${menuAberto ? 'active' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`agradecimento-menu ${menuAberto ? 'open' : ''}`}>
          <Link to="/confirmacao" onClick={() => setMenuAberto(false)}>Confirmar presença</Link>
          <Link to="/presentes" onClick={() => setMenuAberto(false)}>Lista de presentes</Link>
          <Link to="/area-convidado" onClick={() => setMenuAberto(false)}>Área do convidado</Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <section className="agradecimento-container">
        <div className="agradecimento-content">
          {/* MENSAGEM */}
          <h1 className="agradecimento-message">
            {mensagem}
          </h1>

          {/* BOTÃO LISTA DE PRESENTES */}
          <div className="agradecimento-botoes-extra">
            <Link to="/presentes" className="btn-presentes-extra-link">
              <img src={btnPresentes} alt="Lista de Presentes" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
