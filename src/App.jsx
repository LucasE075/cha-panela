import { HashRouter, Routes, Route } from "react-router-dom";
import { GuestProvider, MusicProvider } from "@/context";
import MusicToggle from "@/components/MusicToggle/MusicToggle";

import IdentificacaoPage from "@/pages/Identificacao/IdentificacaoPage";
import IntroducaoPage from "@/pages/Introducao/IntroducaoPage";
import PresentesPage from "@/pages/Presentes/PresentesPage";
import PresencaPage from "@/pages/Presenca/PresencaPage";
import AgradecimentoPage from "@/pages/Agradecimento/AgradecimentoPage";
import AreaConvidadoPage from "@/pages/AreaConvidado/AreaConvidadoPage";
import AgradecimentoPresentePage from "@/pages/AgradecimentoPresente/AgradecimentoPresentePage";

import musica from "@/assets/audio/musica.mp3";

const basename = import.meta.env.BASE_URL || "/";

function App() {
  return (
    <GuestProvider>
      <MusicProvider>
        <HashRouter basename={basename}>
          <MusicToggle />
          <Routes>
            <Route path="/" element={<IdentificacaoPage />} />
            <Route path="/introducao" element={<IntroducaoPage />} />
            <Route path="/presentes" element={<PresentesPage />} />
            <Route path="/confirmacao" element={<PresencaPage />} />
            <Route path="/agradecimento" element={<AgradecimentoPage />} />
            <Route path="/area-convidado" element={<AreaConvidadoPage />} />
            <Route path="/agradecimento-presente" element={<AgradecimentoPresentePage />} />
          </Routes>
          <audio id="global-music" src={musica} loop />
        </HashRouter>
      </MusicProvider>
    </GuestProvider>
  );
}

export default App;