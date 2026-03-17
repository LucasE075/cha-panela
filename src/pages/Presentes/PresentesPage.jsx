import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGuest } from '@/context';
import { supabase } from '@/services/supabase/supabaseClient';

import logo from '@/assets/images/header-logo.png';
import botaoConfirmar from '@/assets/images/btn-confirmar.png';

import './presentes.css';

export default function PresentesPage() {
  const navigate = useNavigate();
  const { guest } = useGuest();

  const [presentes, setPresentes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Carregar presentes
  const carregarPresentes = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('presentes')
        .select(`
          id,
          nome,
          descricao,
          preco,
          imagem,
          selecoes (
            id,
            convidado_id,
            status
          )
        `);

      if (error) {
        console.error('Erro ao carregar presentes:', error);
        throw error;
      }

      setPresentes(data || []);

      // Carregar seleções do convidado atual
      if (guest?.id) {
        const { data: minhasSeleções } = await supabase
          .from('selecoes')
          .select('presente_id, status')
          .eq('convidado_id', guest.id)
          .eq('status', 'selecionado');

        setSelecionados(
          minhasSeleções?.map((s) => s.presente_id) || []
        );
      }
    } catch (erro) {
      console.error('Erro ao carregar presentes:', erro);
    } finally {
      setLoading(false);
    }
  }, [guest?.id]);

  useEffect(() => {
    carregarPresentes();
  }, [carregarPresentes]);

  // Verificar se presente está indisponível
  const estáIndisponível = useCallback(
    (presente) => {
      const selecao = presente.selecoes?.[0];
      if (!selecao) return false;

      // Indisponível se selecionado por outro ou se foi confirmado
      return (
        selecao.convidado_id !== guest?.id ||
        selecao.status === 'confirmado'
      );
    },
    [guest?.id]
  );

  // Toggle seleção de presente
  const toggleSeleção = async (presenteId) => {
    if (!guest?.id) {
      alert('Identifique-se primeiro');
      navigate('/');
      return;
    }

    try {
      const jáSelecionado = selecionados.includes(presenteId);

      if (jáSelecionado) {
        // Remover seleção
        await supabase
          .from('selecoes')
          .delete()
          .eq('presente_id', presenteId)
          .eq('convidado_id', guest.id);

        setSelecionados((prev) =>
          prev.filter((id) => id !== presenteId)
        );
      } else {
        // Verificar disponibilidade
        const { data: selecaoExistente } = await supabase
          .from('selecoes')
          .select('id, convidado_id, status')
          .eq('presente_id', presenteId)
          .maybeSingle();

        if (selecaoExistente) {
          alert('Este presente já foi selecionado por outro convidado.');
          return;
        }

        // Criar nova seleção
        await supabase.from('selecoes').insert({
          presente_id: presenteId,
          convidado_id: guest.id,
          status: 'selecionado',
          eh_presente_fisico: true,
        });

        setSelecionados((prev) => [...prev, presenteId]);
      }

      // Recarregar para atualizar estado
      await carregarPresentes();
    } catch (erro) {
      console.error('Erro ao selecionar presente:', erro);
      alert('Erro ao selecionar presente');
    }
  };

  // Confirmar seleção - vai para Área do Convidado
  const confirmarSeleção = async () => {
    if (selecionados.length === 0) {
      alert('Selecione pelo menos um presente');
      return;
    }

    try {
      setSalvando(true);

      // Presentes já foram gravados como 'selecionado' ao clicar
      // Apenas redirecionar para Área do Convidado
      navigate('/area-convidado');
    } catch (erro) {
      console.error('Erro ao confirmar:', erro);
      alert('Erro ao confirmar seleção');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="presentes-page">
        <h1>Carregando presentes...</h1>
      </div>
    );
  }

  return (
    <div className="presentes-page">
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
      <div className="presentes-container">

        {/* GRID DE PRESENTES */}
        <div className="presentes-grid">
          {presentes.map((presente) => {
            const selecionadoPorMim = selecionados.includes(
              presente.id
            );
            const indisponivel = estáIndisponível(presente);

            return (
              <div
                key={presente.id}
                className={`presente-card 
                  ${selecionadoPorMim ? 'selecionado' : ''}
                  ${indisponivel ? 'indisponivel' : ''}
                `}
              >
                {/* IMAGEM */}
                <div className="presente-imagem">
                  {presente.imagem && (
                    <img
                      src={presente.imagem}
                      alt={presente.nome}
                    />
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className="presente-content">
                  <h3 className="presente-nome">
                    {presente.nome}
                  </h3>

                  {presente.descricao && (
                    <p className="presente-descricao">
                      {presente.descricao}
                    </p>
                  )}

                  {presente.preco && (
                    <span className="presente-preco">
                      R$ {Number(presente.preco).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* BADGE */}
                {selecionadoPorMim && (
                  <div className="badge-selecionado">
                    ✓ Selecionado
                  </div>
                )}

                {indisponivel && !selecionadoPorMim && (
                  <div className="badge-indisponivel">
                    Indisponível
                  </div>
                )}

                {/* BOTÃO */}
                {!indisponivel && (
                  <button
                    className={`btn-selecionar ${
                      selecionadoPorMim ? 'remover' : ''
                    }`}
                    onClick={() => toggleSeleção(presente.id)}
                    disabled={salvando}
                  >
                    {selecionadoPorMim
                      ? 'Remover'
                      : 'Selecionar'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* RESUMO E BOTÃO CONFIRMAR */}
        {selecionados.length > 0 && (
          <div className="presentes-resumo">
            <div className="resumo-info">
              <span className="resumo-texto">
                Você selecionou{' '}
                <strong>{selecionados.length}</strong>{' '}
                {selecionados.length === 1 ? 'presente' : 'presentes'}
              </span>
            </div>

            <button
              className="btn-confirmar-presentes"
              onClick={confirmarSeleção}
              disabled={salvando}
            >
              <img src={botaoConfirmar} alt="Confirmar" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}