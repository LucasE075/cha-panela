import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GuestProvider } from "@/context";

import IdentificacaoPage from "@/pages/Identificacao/IdentificacaoPage";
import IntroducaoPage from "@/pages/Introducao/IntroducaoPage";
import PresentesPage from "@/pages/Presentes/PresentesPage";
import PresencaPage from "@/pages/Presenca/PresencaPage";
import AgradecimentoPage from "@/pages/Agradecimento/AgradecimentoPage";
import AreaConvidadoPage from "@/pages/AreaConvidado/AreaConvidadoPage";
import AgradecimentoPresentePage from "@/pages/AgradecimentoPresente/AgradecimentoPresentePage";

function App() {
  return (
    <GuestProvider>
      <BrowserRouter basename="/cha-panela">
        <Routes>
          <Route path="/" element={<IdentificacaoPage />} />
          <Route path="/introducao" element={<IntroducaoPage />} />
          <Route path="/presentes" element={<PresentesPage />} />
          <Route path="/confirmacao" element={<PresencaPage />} />
          <Route path="/agradecimento" element={<AgradecimentoPage />} />
          <Route path="/area-convidado" element={<AreaConvidadoPage />} />
          <Route path="/agradecimento-presente" element={<AgradecimentoPresentePage />} />
        </Routes>
      </BrowserRouter>
    </GuestProvider>
  );
}

export default App;