namespace ControleGastos.Api.DTOs;

public class TotaisDto
{
    public List<TotalPessoaDto> Pessoas { get; set; } = new();
    public decimal TotalGeralReceitas { get; set; }
    public decimal TotalGeralDespesas { get; set; }
    public decimal SaldoLiquido { get; set; }
}