namespace ControleGastos.Api.Models;

public class Transacao
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;

    //Decimal (Não double): para evitar erros de arredondamento.
    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    //Chave estrangeira (FK): o id da pessoa dono da transação
    public int PessoaId { get; set; }

    // Propriedade de navegação: acesso ao objeto pessoa completo
    public Pessoa Pessoa { get; set; } = null!;
}