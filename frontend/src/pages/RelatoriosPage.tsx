import { useEffect, useState } from "react";
import type { TotaisDto } from "../types";
import { getTotais } from "../services/api";

export function RelatoriosPage() {
  const [totais, setTotais] = useState<TotaisDto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getTotais();
        setTotais(dados);
      } catch (e) {
        if (e instanceof Error) setErro(e.message);
        else setErro("Erro ao carregar totais.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;
  if (!totais) return <p>Nenhum dado.</p>; // segurança: totais ainda null

  return (
  <div>
    <h1>Relatórios</h1>

    <table>
      <thead>
        <tr>
          <th>Pessoa</th>
          <th>Receitas</th>
          <th>Despesas</th>
          <th>Saldo</th>
        </tr>
      </thead>

      <tbody>
        {totais.pessoas.map((pessoa) => (
          <tr key={pessoa.pessoaId}>
            <td>{pessoa.nome}</td>
            <td>R$ {pessoa.totalReceitas.toFixed(2)}</td>
            <td>R$ {pessoa.totalDespesas.toFixed(2)}</td>
            <td>R$ {pessoa.saldo.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <hr />

    <h2>Total Geral</h2>

    <p>
      <strong>Receitas:</strong> R${" "}
      {totais.totalGeralReceitas.toFixed(2)}
    </p>

    <p>
      <strong>Despesas:</strong> R${" "}
      {totais.totalGeralDespesas.toFixed(2)}
    </p>

    <p>
      <strong>Saldo Líquido:</strong> R${" "}
      {totais.saldoLiquido.toFixed(2)}
    </p>
  </div>
);
}