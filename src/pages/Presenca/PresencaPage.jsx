import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGuest } from '@/context';
import { useSupabase } from '@/hooks';

import logo from '@/assets/images/header-logo.png';
import btnSimPresenca from '@/assets/images/btnSimPresenca.png';
import btnNaoPresenca from '@/assets/images/btnNaoPresenca.png';

import './presenca.css';

export default function PresencaPage() {
  const navigate = useNavigate();
  const { guest, setCurrentGuest } = useGuest();
  const { updateGuest, loading } = useSupabase();
  const [respondendo, setRespondendo] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const handlePresenca = async (confirmado) => {
    if (!guest?.id) {
      console.error('Guest não identificado:', guest);
      alert('Por favor, identifique-se primeiro');
      navigate('/');
      return;
    }

    if (respondendo) return;

    try {
      setRespondendo(true);
      console.log('Atualizando presença para:', confirmado);

      // Atualizar no banco
      const guestAtualizado = await updateGuest(guest.id, {
        confirmou_presenca: confirmado,
      });

      console.log('Resposta do servidor:', guestAtualizado);

      // Atualizar contexto
      if (guestAtualizado) {
        setCurrentGuest(guestAtualizado);
      }

      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/agradecimento');
      }, 500);
    } catch (erro) {
      console.error('Erro ao salvar presença:', erro);
      alert('Erro ao confirmar presença. Tente novamente.');
      setRespondendo(false);
    }
  };

  if (loading) {
    return <div className="presenca-loading">Carregando...</div>;
  }

  return (
    <div className="presenca-page">
      {/* HEADER */}
      <header className="presenca-header">
        <div className="presenca-logo-area">
          <img src={logo} alt="logo" className="presenca-logo" />
          <p className="presenca-logo-text">Estella & Lucas</p>
        </div>

        <button 
          className={`presenca-menu-toggle ${menuAberto ? 'active' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`presenca-menu ${menuAberto ? 'open' : ''}`}>
          <Link to="/confirmacao" onClick={() => setMenuAberto(false)}>Confirmar presença</Link>
          <Link to="/presentes" onClick={() => setMenuAberto(false)}>Lista de presentes</Link>
          <Link to="/area-convidado" onClick={() => setMenuAberto(false)}>Área do convidado</Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <section className="presenca-container">

        <div className="presenca-content">
          {/* TÍTULO */}
          <h1 className="presenca-message">
            Pedimos que confirme sua presença para que possamos organizar tudo
            da melhor forma.
          </h1>

          {/* PERGUNTA */}
          <h2 className="presenca-pergunta">
            Você poderá comparecer ao nosso chá?
          </h2>

          {/* BOTÕES SIM/NÃO */}
          <div className="presenca-botoes">
            <button
              className="presenca-botao"
              onClick={() => handlePresenca(true)}
              disabled={respondendo}
              title="Confirmar presença"
            >
              <img 
                src={btnSimPresenca} 
                alt="Sim" 
                className="presenca-botao-img"
              />
              <span className="presenca-botao-label">SIM</span>
            </button>

            <button
              className="presenca-botao"
              onClick={() => handlePresenca(false)}
              disabled={respondendo}
              title="Declinar convite"
            >
              <img 
                src={btnNaoPresenca} 
                alt="Não" 
                className="presenca-botao-img"
              />
              <span className="presenca-botao-label">NÃO</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
