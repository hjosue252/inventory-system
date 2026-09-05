using InventarioApi.Data;
using InventarioApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioApi.Repositories
{
    public class CompraRepository : ICompraRepository
    {
        private readonly ApplicationDbContext _context;

        public CompraRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Compra compra)
        {
            await _context.Compras.AddAsync(compra);
        }

        public async Task<Compra?> GetByIdAsync(int id)
        {
            return await _context.Compras
                .Include(c => c.Detalles)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Compra>> GetAllAsync()
        {
            return await _context.Compras
                .Include(c => c.Detalles)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}