import { BrowserRouter, Routes, Route } from "react-router-dom";

import IdentificacaoPage from "./pages/Identificacao/IdentificacaoPage";
import IntroducaoPage from "./pages/Introducao/IntroducaoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<IdentificacaoPage />}
        />

        <Route
          path="/introducao"
          element={<IntroducaoPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;