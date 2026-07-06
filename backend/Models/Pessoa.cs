namespace ControleGastos.Api.Models;

public class Pessoa
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }

    // Propriedade de navegação: as transacoes desta pessoa (lado N)
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}