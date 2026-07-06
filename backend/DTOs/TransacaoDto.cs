namespace ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;

// DTO de saída: expõe apenas os dados da transação no contrato da API,
// sem a navegação Pessoa (evita ciclo de serialização).
public class TransacaoDto
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public int PessoaId { get; set; }
}