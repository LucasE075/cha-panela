import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollToTop, useRequireGuest } from "@/hooks";

import logo from "@/assets/images/header-logo.png";

import floresEsquerda from "@/assets/images/flowers-left.png";
import floresDireita from "@/assets/images/flowers-right.png";
import ornamentoMedalhao from "@/assets/images/ornament-medalhao.png";

import fotoCasal from "@/assets/images/couple-photo.png";

import floresEventoEsq from "@/assets/images/event-flowers-left.png";
import floresEventoDir from "@/assets/images/event-flowers-right.png";

import tituloOrnamento from "@/assets/images/title-ornament.png";

import iconData from "@/assets/images/icon-date.png";
import iconHora from "@/assets/images/icon-time.png";
import iconLocal from "@/assets/images/icon-location.png";

import divisorOrnamento from "@/assets/images/ornament-divider.png";

import botaoConfirmar from "@/assets/images/btn-confirmar.png";
import botaoPresentes from "@/assets/images/btn-presentes.png";

import "./introducao.css";

export default function IntroducaoPage() {

  const [menuAberto, setMenuAberto] = useState(false);
  useScrollToTop();
  useRequireGuest();

  return (
    <div className="introducao-page">

      {/* HEADER */}
      <header className="presenca-header">
        <Link to="/introducao" style={{textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', flexShrink: 0}}>
          <div className="presenca-logo-area">
            <img src={logo} alt="logo" className="presenca-logo" />
            <p className="presenca-logo-text">Estella & Lucas</p>
          </div>
        </Link>

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

      {/* SEÇÃO CARTA */}
      <section className="secao-carta">

        <img src={floresEsquerda} className="flores-esquerda" alt="" />
        <img src={floresDireita} className="flores-direita" alt="" />
        <img src={ornamentoMedalhao} className="ornamento-medalhao" alt="" />

        <div className="carta">
          <div className="borda-externa">
            <div className="borda-interna">

              <p>Querido e gentil leitor,<br></br>
              <br></br>
              Corre entre os salões desta distinta sociedade que um casamento muito aguardado se aproxima. Contudo, antes que os sinos da igreja anunciem tão importante união, há um evento que promete grande movimentação.<br></br>
              <br></br>
              Estella e Lucas preparam um encantador Chá de Panela, onde risos, doces iguarias e agradáveis surpresas certamente marcarão a ocasião.<br></br>
              <br></br>
              Entre chá, conversas animadas e a tradicional abertura de presentes, os convidados terão o prazer de celebrar este novo capítulo ao lado do estimado casal.<br></br>
              <br></br>
              Resta saber quais histórias esta autora ainda terá o prazer de relatar após tal encontro.<br></br>
              <br></br>
              Verdadeiramente sua,<br></br>
              Lady Whistledown</p>

            </div>
          </div>
        </div>

      </section>

      {/* SEÇÃO FOTO */}
      <section className="secao-foto">
        <img
          src={fotoCasal}
          alt="Estella e Lucas"
          className="foto-casal"
        />
      </section>

      {/* SEÇÃO EVENTO */}
      <section className="secao-evento">

        <img src={floresEventoEsq} className="flores-evento-esq" alt="" />
        <img src={floresEventoDir} className="flores-evento-dir" alt="" />

        <div className="conteudo-evento">

          <img
            src={tituloOrnamento}
            alt=""
            className="ornamento-titulo"
          />

          <div className="info-evento">

            <div className="linha-info">
              <img src={iconData} alt="" />
              <span>Domingo, 12 de abril de 2026</span>
            </div>

            <div className="linha-info">
              <img src={iconHora} alt="" />
              <span>As 16h</span>
            </div>

            <div className="linha-info">
              <img src={iconLocal} alt="" />
              <span>Cond Morada da Serra Quadra 52 casa 17</span>
            </div>

          </div>

          <img
            src={divisorOrnamento}
            alt=""
            className="divisor-ornamento"
          />

          <p className="mensagem-final">
            Sua presença é importantíssima para tonar esse momento ainda mais especial!
          </p>

          <div className="botoes-evento">

            <Link to="/confirmacao">
              <img
                src={botaoConfirmar}
                alt="Confirmar presença"
                className="botao-img"
              />
            </Link>

            <Link to="/presentes">
              <img
                src={botaoPresentes}
                alt="Lista de presentes"
                className="botao-img"
              />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}
