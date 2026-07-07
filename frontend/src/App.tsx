import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PessoasPage } from "./pages/PessoasPage";
import { TransacoesPage } from "./pages/TransacoesPage";
import { RelatoriosPage } from "./pages/RelatoriosPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/pessoas">Pessoas</Link>
        <Link to="/transacoes">Transações</Link>
        <Link to="/relatorios">Relatórios</Link>
      </nav>

      <Routes>
        <Route path="/pessoas" element={<PessoasPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;