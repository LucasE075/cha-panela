import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGuest } from "@/context";
import { supabase } from "@/services/supabase/supabaseClient";

import logo from "@/assets/images/header-logo.png";
import ornamentoDivisor from "@/assets/images/ornament-divider.png";
import btnConfirmar from "@/assets/images/btn-confirmar.png";
import btnConfirmarPresente from "@/assets/images/btn-confirmarPresente.png";
import btnPresentes from "@/assets/images/btn-presentes.png";

import "./areaConvidado.css";

export default function AreaConvidadoPage() {
  const navigate = useNavigate();
  const { guest } = useGuest();

  const [presentes, setPresentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [confirmando, setConfirmando] = useState(null);

  // Determinar status e cor/mensagem
  const getStatusInfo = () => {
    if (guest?.confirmou_presenca === null || guest?.confirmou_presenca === undefined) {
      return {
        status: "Pendente",
        classe: "status-pendente",
        mensagem: "Confirme sua presença"
      };
    }
    if (guest?.confirmou_presenca === true) {
      return {
        status: "Confirmado",
        classe: "status-confirmado",
        mensagem: "✓ Presença confirmada"
      };
    }
    return {
      status: "Recusado",
      classe: "status-recusado",
      mensagem: "✗ Presença recusada"
    };
  };

  // Carregar presentes selecionados
  const carregarPresentes = useCallback(async () => {
    if (!guest?.id) {
      console.error('Sem guest.id');
      return;
    }

    setLoading(true);

    try {
      const { data: selecoes } = await supabase
        .from("selecoes")
        .select(`
          id,
          presente_id,
          status,
          presentes (
            id,
            nome,
            descricao,
            preco,
            imagem,
            tipo
          )
        `)
        .eq("convidado_id", guest.id);

      if (selecoes) {
        setPresentes(selecoes || []);
      }
    } catch (erro) {
      console.error("Erro ao carregar presentes:", erro);
    } finally {
      setLoading(false);
    }
  }, [guest]);

  useEffect(() => {
    if (guest?.id) {
      carregarPresentes();
    }
  }, [carregarPresentes, guest]);

  // Confirmar um presente individual
  const confirmarPresente = async (selecaoId, presenteData) => {
    if (!guest?.id) return;

    try {
      setConfirmando(selecaoId);

      // Atualizar status no banco
      await supabase
        .from("selecoes")
        .update({ status: "confirmado" })
        .eq("id", selecaoId);

      // Redirecionar para página de agradecimento com dados do presente
      navigate("/agradecimento-presente", {
        state: {
          presente: presenteData
        }
      });
    } catch (erro) {
      console.error("Erro ao confirmar presente:", erro);
      alert("Erro ao confirmar presente");
      setConfirmando(null);
    }
  };

  // Confirmar presença (se pendente)
  const confirmarPresenca = async () => {
    try {
      setConfirmando("presenca");
      
      await supabase
        .from("convidados")
        .update({ confirmou_presenca: true })
        .eq("id", guest.id);

      // Recarregar dados
      window.location.reload();
    } catch (erro) {
      console.error("Erro ao confirmar presença:", erro);
      alert("Erro ao confirmar presença");
    } finally {
      setConfirmando(null);
    }
  };

  if (loading) {
    return (
      <div className="area-convidado-page">
        <h1>Carregando...</h1>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="area-convidado-page">
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

      {/* TÍTULO */}
      <h1 className="area-titulo">Área do Convidado</h1>

      {/* DIVISOR */}
      <img src={ornamentoDivisor} alt="" className="area-divisor" />

      {/* CONTAINER PRINCIPAL */}
      <div className="area-main-container">
        
        {/* SEÇÃO DADOS DO CONVIDADO */}
        <div className="area-dados-section">
          <div className="area-dados-header">
            <h2 className="area-dados-titulo">Dados do Convidado</h2>
          </div>

          <div className="area-dados-content">
            <div className="dado-item">
              <span className="dado-label">Nome:</span>
              <span className="dado-valor">{guest?.nome || "N/A"}</span>
            </div>

            <div className="dado-item">
              <span className="dado-label">Telefone:</span>
              <span className="dado-valor">{guest?.celular || "N/A"}</span>
            </div>

            <div className="dado-item">
              <span className={`dado-label status-label ${statusInfo.classe}`}>
                Status: <strong>{statusInfo.mensagem}</strong>
              </span>
            </div>

            {/* BOTÃO CONFIRMAR (apenas se pendente) */}
            {guest?.confirmou_presenca === null || guest?.confirmou_presenca === undefined ? (
              <button 
                className="btn-confirmar-presenca"
                onClick={confirmarPresenca}
                disabled={confirmando === "presenca"}
              >
                <img src={btnConfirmar} alt="Confirmar presença" />
              </button>
            ) : null}
          </div>
        </div>

        {/* SEÇÃO PRESENTES */}
        <div className="area-presentes-section">
          <div className="area-presentes-header">
            <h2 className="area-presentes-titulo">Presentes Selecionados</h2>
          </div>

          <div className="area-presentes-content">
            {presentes.length === 0 ? (
              <p className="presentes-vazio">Nenhum presente selecionado</p>
            ) : (
              <div className="presentes-lista">
                {presentes.map((selecao) => {
                  const presente = selecao.presentes;
                  const jáConfirmado = selecao.status === "confirmado";

                  return (
                    <div key={selecao.id} className="presente-item">
                      {/* COLUNA 1: IMAGEM */}
                      <div className="presente-info">
                        {presente.imagem && (
                          <img src={presente.imagem} alt={presente.nome} className="presente-thumb" />
                        )}
                      </div>

                      {/* COLUNA 2: DETALHES */}
                      <div className="presente-details">
                        <h3>{presente.nome}</h3>
                        {presente.descricao && (
                          <p>{presente.descricao}</p>
                        )}
                        {presente.preco && (
                          <span className="presente-price">
                            R$ {Number(presente.preco).toFixed(2)}
                          </span>
                        )}
                        {jáConfirmado && (
                          <span className="badge-confirmado">✓ Confirmado</span>
                        )}
                      </div>

                      {/* COLUNA 3: BOTÕES */}
                      <div className="presente-botoes">
                        {!jáConfirmado && (
                          <button 
                            className="btn-presente"
                            onClick={() => confirmarPresente(selecao.id, presente)}
                            disabled={confirmando === selecao.id}
                            title="Confirmar este presente"
                          >
                            <img src={btnConfirmarPresente} alt="Confirmar" />
                          </button>
                        )}
                        
                        <button 
                          className="btn-presente"
                          onClick={() => navigate("/presentes")}
                          title="Voltar à lista de presentes"
                        >
                          <img src={btnPresentes} alt="Presentes" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
