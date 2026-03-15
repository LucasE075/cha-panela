import { BrowserRouter, Routes, Route } from "react-router-dom";

import IdentificacaoPage from "./src/pages/Identificacao/IdentificacaoPage";
import IntroducaoPage from "./src/pages/Introducao/IntroducaoPage";

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