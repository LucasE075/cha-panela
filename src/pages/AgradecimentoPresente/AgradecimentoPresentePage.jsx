import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGuest } from '@/context';

import logo from '@/assets/images/header-logo.png';
import qrcodeImage from '@/assets/images/qrcode.png';

import './agradecimentoPresente.css';

export default function AgradecimentoPresentePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { guest } = useGuest();
  const [menuAberto, setMenuAberto] = useState(false);

  // Obter dados do presente do state
  const presente = location.state?.presente;

  // Se não tem guest, redirecionar
  if (!guest) {
    navigate('/');
    return null;
  }

  // Se não tem presente, voltar para área do convidado
  if (!presente) {
    navigate('/area-convidado');
    return null;
  }

  // Determinar tipo do presente (padrão: físico)
  const tipoPresente = presente.tipo || 'fisico';
  const isPix = tipoPresente === 'pix_fechado' || tipoPresente === 'pix_livre';
  const isFisico = tipoPresente === 'fisico';

  // Mensagens personalizadas
  const getTituloMensagem = () => {
    if (isFisico) {
      return `Obrigada por ${presente.nome}!`;
    }
    return `PIX recebido com sucesso!`;
  };

  const getMensagemDetalhes = () => {
    if (isFisico) {
      return `Muito obrigada por escolher ${presente.nome}! 💝 Sua doação será essencial para deixar nosso Chá de Panela especial.`;
    }
    if (tipoPresente === 'pix_fechado') {
      return `Obrigada pela sua contribuição! Use o QR Code abaixo para confirmar seu presente.`;
    }
    return `Obrigada pela sua contribuição! Você pode enviar qualquer valor através do QR Code abaixo.`;
  };

  return (
    <div className="agradecimento-presente-page">
      {/* HEADER */}
      <header className="area-header">
        <div className="area-logo-area">
          <img src={logo} alt="logo" className="area-logo" />
          <p className="area-logo-text">Estella & Lucas</p>
        </div>

        <button 
          className={`area-menu-toggle ${menuAberto ? 'active' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`area-menu ${menuAberto ? 'open' : ''}`}>
          <Link to="/confirmacao" onClick={() => setMenuAberto(false)}>Confirmar presença</Link>
          <Link to="/presentes" onClick={() => setMenuAberto(false)}>Lista de presentes</Link>
          <Link to="/area-convidado" onClick={() => setMenuAberto(false)}>Área do convidado</Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <section className="agr-presente-container">
        <div className="agr-presente-content">
          {/* ÍCONE PRESENTE */}
          <div className="presente-icon">🎁</div>

          {/* TÍTULO PERSONALIZADO */}
          <h1 className="agr-presente-title">
            {getTituloMensagem()}
          </h1>

          {/* MENSAGEM PERSONALIZADA */}
          <p className="agr-presente-mensagem">
            {getMensagemDetalhes()}
          </p>

          {/* SEÇÃO PIX (se for pix_fechado ou pix_livre) */}
          {isPix && (
            <div className="agr-presente-pix-section">
              {/* QR CODE */}
              <img 
                src={qrcodeImage} 
                alt="QR Code PIX" 
                className="agr-presente-qrcode" 
              />

              {/* VALOR (se existir) */}
              {presente.preco && (
                <div className="agr-presente-valor">
                  <p className="valor-label">Valor sugerido:</p>
                  <p className="valor-amount">R$ {Number(presente.preco).toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* DETALHES FINAIS */}
          <p className="agr-presente-detalhes">
            Suas seleções foram registradas e nos ajudarão a preparar tudo com carinho 
            para o nosso Chá de Panela. Esperamos você lá!
          </p>

          {/* BOTÃO VOLTAR */}
          <div className="agr-presente-botoes">
            <Link to="/area-convidado" className="btn-voltar">
              Voltar para Área do Convidado
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
