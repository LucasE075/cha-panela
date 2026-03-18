import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGuest } from '@/context';
import { useScrollToTop, useRequireGuest } from '@/hooks';
import Header from '@/components/Header';
import qrcodeImage from '@/assets/images/qrcode.png';
import copiarTextoIcon from '@/assets/images/copiar-texto.png';

import './agradecimentoPresente.css';

export default function AgradecimentoPresentePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { guest } = useGuest();
  const [copiado, setCopiado] = useState(false);
  const [copiadoCpf, setCopiadoCpf] = useState(false);
  useScrollToTop();
  useRequireGuest();

  // Código PIX
  const PIX_CODE = '00020126330014BR.GOV.BCB.PIX0111065196341905204000053039865802BR5925Estella Gabriela Santos d6009SAO PAULO62140510SEI5aCq2qL63043B2D';
  const PIX_CPF = '065.196.341-90';

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

  const copiarCpfPix = async () => {
    try {
      await navigator.clipboard.writeText(PIX_CPF);
      setCopiadoCpf(true);
      setTimeout(() => setCopiadoCpf(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar CPF:', err);
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

  const getMensagemDetalhes = () => {
    if (isFisico) {
      return `Muito obrigada por escolher ${presente.nome}! 💝 `;
    }
    if (tipoPresente === 'pix_fechado') {
      return `Obrigada pelo presente! Abaixo tem as informações para o Pix: `;
    }
    return `Obrigada pelo presente!  Você pode enviar qualquer valor através do QR Code abaixo.`;
  };

  return (
    <div className="agradecimento-presente-page">
      <Header />

      {/* MAIN CONTENT */}
      <section className="agr-presente-container">
        <div className="agr-presente-content">
          {/* ÍCONE PRESENTE */}
          <div className="presente-icon">🎁</div>

          {/* TÍTULO PERSONALIZADO */}

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
                  <img
                    src={copiarTextoIcon}
                    alt="Copiar código PIX"
                    className="pix-copy-icon"
                  />
                  {copiado ? '✓ Copiado!' : 'Copiar'}
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
              <p className="pix-dado">
                <span className="pix-label">Chave Pix:</span>
                <button
                  type="button"
                  className="pix-copy-inline"
                  onClick={copiarCpfPix}
                  title="Clique para copiar"
                >
                  {PIX_CPF}
                </button>
                <span className="pix-copy-feedback">
                  <img
                    src={copiarTextoIcon}
                    alt="Copiar CPF"
                    className="pix-copy-icon"
                  />
                  {copiadoCpf ? '✓ Copiado!' : 'Copiar'}
                </span>
              </p>
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
