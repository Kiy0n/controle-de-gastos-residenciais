using ControleGastos.Api.Data;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> GetPessoas()
    {
        var pessoas = await _context.Pessoas.ToListAsync();

        return Ok(pessoas);
    }
    
    [HttpPost]
    public async Task<ActionResult<Pessoa>> PostPessoa(Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPessoas), new { id = pessoa.Id }, pessoa);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePessoa(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);

        if (pessoa == null)
        {
            return NotFound();
        }

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}