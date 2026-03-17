import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuest, useMusic } from "@/context";
import { useScrollToTop } from "@/hooks";
import { supabase } from "../../services/supabase/supabaseClient";

import logo from "../../assets/images/logo.png";
import casal from "../../assets/images/casal.png";
import selo from "../../assets/images/selo.png";

import "./identificacao.css";

export default function IdentificacaoPage() {
  const navigate = useNavigate();
  const { setCurrentGuest } = useGuest();
  const { isPlaying, toggleMusic } = useMusic();

  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useScrollToTop();

  async function handleEntrar() {
    if (loading) return;

    setErro("");

    if (!celular) {
      setErro("Informe seu número.");
      return;
    }

    try {
      setLoading(true);

      // buscar convidado pelo celular
      let { data: convidado, error } = await supabase
        .from("convidados")
        .select("*")
        .eq("celular", celular)
        .maybeSingle();

      if (error) throw error;

      // se não existir criar
      if (!convidado) {
        const { data: novoConvidado, error: insertError } = await supabase
          .from("convidados")
          .insert({
            nome: nome,
            celular: celular
          })
          .select()
          .single();

        if (insertError) throw insertError;

        convidado = novoConvidado;
      }

      // Salvar no contexto
      setCurrentGuest(convidado);

      // redirecionar
      navigate("/introducao");

    } catch (err) {
      console.error(err);
      setErro("Erro ao acessar o sistema.");

    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleEntrar();
  }

  return (
    <div className="pagina">

      <div className="convite">

        <img
          src={logo}
          alt="logo"
          className="logo"
        />

        <img
          src={casal}
          alt="casal"
          className="casal"
        />

        <h2 className="titulo">
          Chá de Panela
        </h2>

        <h1 className="nomes">
          Estella e Lucas
        </h1>

        <form
          className="formulario"
          onSubmit={handleSubmit}
        >

          <div className="campo">
            <label>
              Informe seu Nome:
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              placeholder="Seu nome"
            />
          </div>

          <div className="campo">
            <label>
              Informe seu Número:
            </label>

            <input
              type="tel"
              value={celular}
              onChange={(e) =>
                setCelular(e.target.value)
              }
              placeholder="(00) 00000-0000"
            />
          </div>

          <button
            type="submit"
            className="botao"
            disabled={loading}
          >
            <img
              src={selo}
              alt="Entrar"
            />
          </button>

        </form>

        {erro && (
          <p className="erro">
            {erro}
          </p>
        )}

      </div>

    </div>
  );
}