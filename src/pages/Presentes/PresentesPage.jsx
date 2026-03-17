import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGuest } from '@/context';
import { supabase } from '@/services/supabase/supabaseClient';

import logo from '@/assets/images/header-logo.png';
import btnConfirmarPresente from "@/assets/images/btn-confirmarPresente.png";

import './presentes.css';

export default function PresentesPage() {
  const navigate = useNavigate();
  const { guest } = useGuest();

  const [presentes, setPresentes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Função para validar e formatar URL
  const formatarURL = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    const urlLimpa = url.trim();
    if (!urlLimpa) return null;
    
    // Se não começa com http/https, adiciona https://
    if (!urlLimpa.match(/^https?:\/\//)) {
      return `https://${urlLimpa}`;
    }
    
    return urlLimpa;
  };

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
          tipo,
          cor,
          link1,
          link2,
          link3,
          selecoes (
            id,
            convidado_id,
            status
          )
        `);

      console.log('Presentes carregados:', data);
      if (error) console.error('Erro na query:', error);
      
      const sortedData = (data || []).sort((a, b) => {
        return a.nome.localeCompare(b.nome, 'pt-BR');
      });
      
      // Debug: mostrar campos de links dos primeiros presentes
      console.log('Primeiros presentes com links:', sortedData.slice(0, 3).map(p => ({
        id: p.id,
        nome: p.nome,
        tipo: p.tipo,
        link1: p.link1,
        link2: p.link2,
        link3: p.link3
      })));
      
      setPresentes(sortedData);

      // Carregar seleções do convidado atual
      if (guest?.id) {
        const { data: minhasSeleções } = await supabase
          .from('selecoes')
          .select('presente_id, status')
          .eq('convidado_id', guest.id)
          .eq('status', 'selecionado');

        // Apenas atualizar se houver dados (evita limpar o estado local se a replicação estiver lenta)
        if (minhasSeleções && minhasSeleções.length > 0) {
          setSelecionados(
            minhasSeleções.map((s) => s.presente_id)
          );
        }
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
  // Apenas presentes do tipo 'fisico' são únicos
  const estáIndisponível = useCallback(
    (presente) => {
      // Pix livre e pix fechado podem ser comprados por múltiplos usuários
      if (presente.tipo !== 'fisico') {
        return false;
      }

      const selecoes = Array.isArray(presente.selecoes) ? presente.selecoes : (presente.selecoes ? [presente.selecoes] : []);
      if (selecoes.length === 0) return false;

      // Verificar se há alguma seleção confirmada
      const temConfirmado = selecoes.some(s => s.status === 'confirmado');
      if (temConfirmado) return true;

      // Verificar se há seleção de outro usuário
      const selecaoDeOutro = selecoes.find(s => s.convidado_id !== guest?.id && s.status === 'selecionado');
      if (selecaoDeOutro) return true;

      return false;
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

    const presente = presentes.find(p => p.id === presenteId);
    
    // Guard: verificar se o presente existe
    if (!presente) {
      console.error('Presente não encontrado:', presenteId);
      alert('Erro: presente não encontrado');
      return;
    }

    const jáSelecionado = selecionados.includes(presenteId);
    
    console.log('Toggle seleção:', {
      presenteId,
      jáSelecionado,
      selecionadosAntes: selecionados.length,
      tipo: presente.tipo
    });

    try {
      if (jáSelecionado) {
        // Remover seleção - atualizar estado ANTES do banco
        setSelecionados((prev) => {
          const novo = prev.filter((id) => id !== presenteId);
          console.log('Removendo, novo estado:', novo);
          return novo;
        });

        await supabase
          .from('selecoes')
          .delete()
          .eq('presente_id', presenteId)
          .eq('convidado_id', guest.id);
      } else {
        // Verificar disponibilidade apenas para presentes 'fisico'
        if (presente.tipo === 'fisico') {
          const { data: selecaoExistente } = await supabase
            .from('selecoes')
            .select('id, convidado_id, status')
            .eq('presente_id', presenteId)
            .maybeSingle();

          if (selecaoExistente) {
            alert('Este presente já foi selecionado por outro convidado.');
            return;
          }
        }

        // Adicionar seleção - atualizar estado ANTES do banco para feedback imediato
        setSelecionados((prev) => {
          const novo = [...prev, presenteId];
          console.log('Adicionando, novo estado:', novo);
          return novo;
        });

        await supabase.from('selecoes').insert({
          presente_id: presenteId,
          convidado_id: guest.id,
          status: 'selecionado',
          eh_presente_fisico: true,
        });
      }
    } catch (erro) {
      console.error('Erro ao selecionar presente:', erro, erro.message);
      alert('Erro ao selecionar presente: ' + erro.message);
      // Se houver erro, reverter o estado apenas se foi adição
      if (!jáSelecionado) {
        setSelecionados((prev) => prev.filter((id) => id !== presenteId));
      }
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

      {/* MAIN CONTENT */}
      <div className="presentes-container">

        {/* GRID DE PRESENTES */}
        <div className="presentes-grid">
          {presentes.map((presente) => {
            const selecionadoPorMim = selecionados.includes(
              presente.id
            );
            const indisponivel = estáIndisponível(presente);

            const tipoClass = presente.tipo
              ? `tipo-${presente.tipo.replace(/_/g, '-')}`
              : '';

            return (
              <button
                key={presente.id}
                type="button"
                className={`presente-card ${tipoClass} 
                  ${selecionadoPorMim ? 'selecionado' : ''}
                  ${indisponivel ? 'indisponivel' : ''}
                `}
                onClick={() => {
                  if (!indisponivel && !salvando) {
                    toggleSeleção(presente.id);
                  }
                }}
                disabled={indisponivel || salvando}
              >
                <h3 className="presente-nome">{presente.nome}</h3>

                {/* IMAGEM */}
                <div className="presente-imagem">
                  {presente.imagem && (
                    <img src={presente.imagem} alt={presente.nome} />
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className="presente-content">
                  {presente.tipo === 'fisico' && (
                    <>
                      {presente.cor && (
                        <p className="presente-cor">
                          <strong>Sugestão de cores:</strong> {presente.cor}
                        </p>
                      )}

                      {(formatarURL(presente.link1) || formatarURL(presente.link2) || formatarURL(presente.link3)) && (
                        <div className="presente-links">
                          <span className="links-label">
                            Link para se inspirar:
                          </span>
                          <div className="links-list">
                            {formatarURL(presente.link1) && (
                              <a
                                href={formatarURL(presente.link1)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Sugestão 1
                              </a>
                            )}
                            {formatarURL(presente.link2) && (
                              <a
                                href={formatarURL(presente.link2)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Sugestão 2
                              </a>
                            )}
                            {formatarURL(presente.link3) && (
                              <a
                                href={formatarURL(presente.link3)}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Sugestão 3
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {presente.tipo === 'pix_livre' && presente.descricao && (
                    <p className="presente-descricao">
                      {presente.descricao}
                    </p>
                  )}

                  {presente.tipo === 'pix_fechado' && presente.preco && (
                    <span className="presente-preco">
                      R$ {Number(presente.preco).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* BADGE */}
                {selecionadoPorMim && (
                  <div className="badge-selecionado">✓ Selecionado</div>
                )}

                {indisponivel && !selecionadoPorMim && (
                  <div className="badge-indisponivel">Indisponível</div>
                )}

                <span className="presente-acao">Selecionar</span>
              </button>
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
              <img src={btnConfirmarPresente} alt="Confirmar" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}