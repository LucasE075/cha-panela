import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGuest } from '@/context';
import { useScrollToTop, useRequireGuest } from '@/hooks';

import logo from '@/assets/images/header-logo.png';
import qrcodeImage from '@/assets/images/qrcode.png';

import './agradecimentoPresente.css';

export default function AgradecimentoPresentePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { guest } = useGuest();
  const [menuAberto, setMenuAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  useScrollToTop();
  useRequireGuest();

  // Código PIX
  const PIX_CODE = '00020126330014BR.GOV.BCB.PIX0111065196341905204000053039865802BR5925Estella Gabriela Santos d6009SAO PAULO62140510SEI5aCq2qL63043B2D';

  // Copiar código para clipboard
  const copiarCodigoPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CODE);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

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
    return `Escaneie o QR Code para ${tipoPresente === 'pix_fechado' ? 'confirmar seu presente' : 'enviar sua contribuição'}!`;
  };

  const getMensagemDetalhes = () => {
    if (isFisico) {
      return `Muito obrigada por escolher ${presente.nome}! 💝 `;
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
        <Link to="/introducao" style={{textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0}}>
          <div className="area-logo-area">
            <img src={logo} alt="logo" className="area-logo" />
            <p className="area-logo-text">Estella & Lucas</p>
          </div>
        </Link>

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

              {/* CÓDIGO PIX CLICÁVEL */}
              <button
                onClick={copiarCodigoPix}
                className="agr-presente-pix-code"
                title="Clique para copiar o código PIX"
              >
                <span className="pix-code-text">{PIX_CODE}</span>
                <span className="pix-copy-feedback">
                  {copiado ? '✓ Copiado!' : '📋 Clique para copiar'}
                </span>
              </button>

              {/* VALOR (se existir) */}
              {presente.preco && (
                <div className="agr-presente-valor">
                  <p className="valor-label">Valor sugerido:</p>
                  <p className="valor-amount">R$ {Number(presente.preco).toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* DADOS PIX */}
          {isPix && (
            <div className="agr-presente-pix-dados">
              <p className="pix-dado"><span className="pix-label">Chave Pix:</span> 065.196.341-90</p>
              <p className="pix-dado"><span className="pix-label">Nome:</span> Estella Gabriela Santos de Oliveira</p>
              <p className="pix-dado"><span className="pix-label">Banco:</span> 260 - Nu Pagamentos S.A. - Instituição de Pagamento</p>
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
