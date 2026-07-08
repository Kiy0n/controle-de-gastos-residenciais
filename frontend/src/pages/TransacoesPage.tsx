import { useEffect, useState } from "react";
import type { Pessoa, Transacao, TipoTransacao } from "../types";
import { getPessoas, getTransacoes, criarTransacao } from "../services/api";

export function TransacoesPage() {
  // Lista de transações
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // Lista de pessoas (será utilizada no select futuramente)
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  // Estados da página
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [pessoaId, setPessoaId] = useState("");

  // Carrega os dados quando a página abre
  useEffect(() => {
    async function carregarDados() {
      try {
        const [listaTransacoes, listaPessoas] = await Promise.all([
          getTransacoes(),
          getPessoas(),
        ]);

        setTransacoes(listaTransacoes);
        setPessoas(listaPessoas);
      } catch (e) {
        if (e instanceof Error) {
          setErro(e.message);
        } else {
          setErro("Erro ao carregar dados.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Criar transação
  async function handleCriar() {
  try {
    const dto = {
      descricao,
      valor: Number(valor),
      tipo,
      pessoaId: Number(pessoaId),
    };

    await criarTransacao(dto);

    const dados = await getTransacoes();
    setTransacoes(dados);

    // limpar os campos
    setDescricao("");
    setValor("");
    setTipo("Despesa");
    setPessoaId("");
    setErro(null);
  } catch (e) {
    if (e instanceof Error) setErro(e.message);
    else setErro("Erro ao criar transação.");
  }
}

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>Erro: {erro}</p>;
  }

  return (
    <div>
      <h1>Transações</h1>

      <div>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição"
        />

        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder="Valor"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoTransacao)}
        >
          <option value="Despesa">Despesa</option>
          <option value="Receita">Receita</option>
        </select>

        <select
          value={pessoaId}
          onChange={(e) => setPessoaId(e.target.value)}
        >
          <option value="">Selecione uma pessoa</option>
          {pessoas.map((pessoa) => (
            <option key={pessoa.id} value={pessoa.id}>
              {pessoa.nome}
            </option>
          ))}
        </select>

        <button onClick={handleCriar}>Criar</button>
      </div>

      {transacoes.length === 0 ? (
        <p>Nenhuma transação cadastrada.</p>
      ) : (
        <ul>
          {transacoes.map((transacao) => {
            const pessoa = pessoas.find((p) => p.id === transacao.pessoaId);
            return (
              <li key={transacao.id}>
                <strong>{transacao.descricao}</strong>
                <br />
                Tipo: {transacao.tipo}
                <br />
                Valor: R$ {transacao.valor.toFixed(2)}
                <br />
                Pessoa: {pessoa?.nome}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}