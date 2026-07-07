import { useState, useEffect } from "react";
import type { Pessoa } from "../types";
import { getPessoas, criarPessoa, deletarPessoa } from "../services/api";

export function PessoasPage() {
  // Lista de pessoas
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  // Estados da página
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");

  // Carrega as pessoas ao abrir a página
  useEffect(() => {
    async function carregarPessoas() {
      try {
        const dados = await getPessoas();
        setPessoas(dados);
      } catch (e) {
        if (e instanceof Error) {
          setErro(e.message);
        } else {
          setErro("Erro ao carregar pessoas.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarPessoas();
  }, []);

  // Cria uma nova pessoa
  async function handleCriar() {
    try {
      const dto = {
        nome,
        idade: Number(idade),
      };

      await criarPessoa(dto);

      const dados = await getPessoas();
      setPessoas(dados);

      setNome("");
      setIdade("");
      setErro(null);
    } catch (e) {
      if (e instanceof Error) {
        setErro(e.message);
      } else {
        setErro("Erro ao criar pessoa.");
      }
    }
  }

  // Deleta uma pessoa
  async function handleDeletar(id: number) {
    try {
      await deletarPessoa(id);
      
      const dados = await getPessoas();
      setPessoas(dados);

      setErro(null);
    } catch (e) {
      if (e instanceof Error) {
        setErro(e.message);
      } else {
        setErro("Erro ao excluir pessoa.");
      }
    }
  }

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div>
      <h1>Pessoas</h1>

      <div>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome"
        />

        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Idade"
        />

        <button onClick={handleCriar}>Criar</button>
      </div>

      <ul>
        {pessoas.map((pessoa) => (
          <li key={pessoa.id}>
            {pessoa.nome} — {pessoa.idade} anos <button onClick={() => handleDeletar(pessoa.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}