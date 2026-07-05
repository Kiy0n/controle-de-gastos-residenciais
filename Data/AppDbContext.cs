using Microsoft.EntityFrameworkCore;
using ControleGastos.Api.Models;

namespace ControleGastos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }

    public DbSet<Pessoa> Pessoas { get; set; }
}