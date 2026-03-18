import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuest } from '@/context';
import { useScrollToTop, useRequireGuest } from '@/hooks';
import { supabase } from '@/services/supabase/supabaseClient';
import Header from '@/components/Header';

import btnConfirmarPresente from "@/assets/images/btn-confirmarPresente.png";

import './presentes.css';

export default function PresentesPage() {
  const navigate = useNavigate();
  const { guest } = useGuest();

  const [presentes, setPresentes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  useScrollToTop();
  useRequireGuest();

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
      const { data } = await supabase
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
      
      // IDs que devem aparecer primeiro
      const idsFixos = ['f85fadf5-33d9-4a29-bbde-b9d9a17b49a8', 'b5df096c-f05b-4031-aaf6-1ba56b8a69e8'];
      
      // Carregar seleções do convidado atual
      let minhasSelecionadas = [];
      if (guest?.id) {
        const { data: minhasSeleções } = await supabase
          .from('selecoes')
          .select('presente_id, status')
          .eq('convidado_id', guest.id)
          .eq('status', 'selecionado');

        if (minhasSeleções && minhasSeleções.length > 0) {
          minhasSelecionadas = minhasSeleções.map((s) => s.presente_id);
        }
      }
      
      // Ordenar presentes seguindo a lógica:
      // 1. Presentes fixos (pelos IDs)
      // 2. Presentes selecionados pelo usuário (por ordem alfabética)
      // 3. Demais presentes (por ordem alfabética)
      const sortedData = (data || []).sort((a, b) => {
        const aEhFixo = idsFixos.includes(a.id);
        const bEhFixo = idsFixos.includes(b.id);
        
        const aEhSelecionado = minhasSelecionadas.includes(a.id);
        const bEhSelecionado = minhasSelecionadas.includes(b.id);
        
        // Se ambos são fixos, manter a ordem dos IDs fixos
        if (aEhFixo && bEhFixo) {
          return idsFixos.indexOf(a.id) - idsFixos.indexOf(b.id);
        }
        
        // Fixos vêm primeiro
        if (aEhFixo && !bEhFixo) return -1;
        if (!aEhFixo && bEhFixo) return 1;
        
        // Depois, selecionados pelo usuário
        if (aEhSelecionado && !bEhSelecionado) return -1;
        if (!aEhSelecionado && bEhSelecionado) return 1;
        
        // Por fim, ordem alfabética
        return a.nome.localeCompare(b.nome, 'pt-BR');
      });
      
      setPresentes(sortedData);

      // Apenas atualizar se houver dados (evita limpar o estado local se a replicação estiver lenta)
      if (minhasSelecionadas.length > 0) {
        setSelecionados(minhasSelecionadas);
      }
    } catch {
      // Erro ao carregar presentes
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
      alert('Erro: presente não encontrado');
      return;
    }

    const jáSelecionado = selecionados.includes(presenteId);

    try {
      if (jáSelecionado) {
        // Remover seleção - atualizar estado ANTES do banco
        setSelecionados((prev) => {
          const novo = prev.filter((id) => id !== presenteId);
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
    } catch {
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
      <Header />

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