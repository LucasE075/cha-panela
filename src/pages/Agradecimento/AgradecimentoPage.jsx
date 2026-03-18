import { Link } from 'react-router-dom';
import { useGuest } from '@/context';
import { useScrollToTop, useRequireGuest } from '@/hooks';
import Header from '@/components/Header';
import btnPresentes from '@/assets/images/btn-presentes.png';

import './agradecimento.css';

export default function AgradecimentoPage() {
  const { guest } = useGuest();
  useScrollToTop();
  useRequireGuest();

  // Determinar a mensagem com base na presença
  const mensagem =
    guest?.confirmou_presenca === true
      ? 'Obrigada por confirmar sua presença! Que alegria poder compartilhar esse momento especial com você. Nos vemos no nosso Chá de Panela!'
      : 'Obrigada por confirmar sua presença! Que pena, sentiremos sua falta no nosso Chá de Panela, mas esperamos nos encontrar em breve.';

  return (
    <div className="agradecimento-page">
      <Header />

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
