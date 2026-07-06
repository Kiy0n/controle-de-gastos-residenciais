using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly AppDbContext _context;

    public RelatoriosController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("totais")]
    public async Task<ActionResult<TotaisDto>> GetTotais()
    {
        // Traz cada pessoa com suas transações somadas por tipo
        var totaisPessoas = await _context.Pessoas
            .Select(p => new TotalPessoaDto
            {
                PessoaId = p.Id,
                Nome = p.Nome,
                TotalReceitas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor),
                TotalDespesas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor)
            })
            .ToListAsync();

        // Calcula o saldo de cada pessoa (receitas - despesas)
        foreach (var pessoa in totaisPessoas)
        {
            pessoa.Saldo = pessoa.TotalReceitas - pessoa.TotalDespesas;
        }

        // Monta o envelope com os totais gerais
        var resultado = new TotaisDto
        {
            Pessoas = totaisPessoas,
            TotalGeralReceitas = totaisPessoas.Sum(p => p.TotalReceitas),
            TotalGeralDespesas = totaisPessoas.Sum(p => p.TotalDespesas)
        };

        resultado.SaldoLiquido = resultado.TotalGeralReceitas - resultado.TotalGeralDespesas;

        return Ok(resultado);
    }
}