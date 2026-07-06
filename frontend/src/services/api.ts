import type {
  Pessoa,
  CriarPessoaDto,
  Transacao,
  CriarTransacaoDto,
  TotaisDto,
} from "../types";

const API_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;

    try {
      message = await response.text();
    } catch {
      // Mantém a mensagem padrão caso não exista corpo.
    }

    throw new Error(message);
  }

  // DELETE retorna 204 (No Content), portanto não há JSON para desserializar.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/* Pessoas */

export function getPessoas() {
  return request<Pessoa[]>("/Pessoas");
}

export function criarPessoa(dto: CriarPessoaDto) {
  return request<Pessoa>("/Pessoas", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function deletarPessoa(id: number) {
  return request<void>(`/Pessoas/${id}`, {
    method: "DELETE",
  });
}

/* Transações */

export function getTransacoes() {
  return request<Transacao[]>("/Transacoes");
}

export function criarTransacao(dto: CriarTransacaoDto) {
  return request<Transacao>("/Transacoes", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/* Relatórios */

export function getTotais() {
  return request<TotaisDto>("/Relatorios/totais");
}