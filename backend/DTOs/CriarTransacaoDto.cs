namespace ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;

// DTO de entrada: representa apenas os campos que o cliente deve enviar
// ao criar uma transação (sem Id gerado nem navegação Pessoa).
public class CriarTransacaoDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }
    public int PessoaId { get; set; }
}