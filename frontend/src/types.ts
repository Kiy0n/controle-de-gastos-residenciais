export type TipoTransacao = "Receita" | "Despesa";

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export interface CriarPessoaDto {
  nome: string;
  idade: number;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
}

export interface CriarTransacaoDto {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: number;
}

export interface TotalPessoaDto {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisDto {
  pessoas: TotalPessoaDto[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number;
}