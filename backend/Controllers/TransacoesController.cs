using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using ControleGastos.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoDto>>> GetTransacoes()
    {
        var transacoes = await _context.Transacoes
            .Select(t => new TransacaoDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                PessoaId = t.PessoaId
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    [HttpPost]
    public async Task<ActionResult<TransacaoDto>> PostTransacao(CriarTransacaoDto dto)
    {
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);

        if (pessoa == null)
            return NotFound($"Pessoa com id {dto.PessoaId} não encontrada.");

        // Regra de negócio: menor de 18 anos só pode cadastrar despesas
        if (pessoa.Idade < 18 && dto.Tipo != TipoTransacao.Despesa)
            return BadRequest("Pessoas menores de 18 anos só podem cadastrar despesas.");

        // (a) Mapeamento DTO de entrada → Entidade (para persistir)
        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();
        // após o SaveChanges, transacao.Id já foi preenchido pelo banco

        // (b) Mapeamento Entidade → DTO de saída (para retornar)
        var resultado = new TransacaoDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            PessoaId = transacao.PessoaId
        };

        return CreatedAtAction(nameof(GetTransacoes), new { id = transacao.Id }, resultado);
    }
}