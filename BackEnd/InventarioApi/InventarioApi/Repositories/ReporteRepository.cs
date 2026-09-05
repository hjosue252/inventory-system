using InventarioApi.Data;
using InventarioApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioApi.Repositories
{
    public class ReporteRepository : IReporteRepository
    {
        private readonly ApplicationDbContext _context;

        public ReporteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Venta>> GetVentasByDateRangeAsync(
            DateTime fechaInicio,
            DateTime fechaFin)
        {
            return await _context.Ventas
                .AsNoTracking()
                .Include(v => v.Cliente)
                .Include(v => v.Detalles)
                .Where(v => v.Fecha >= fechaInicio && v.Fecha <= fechaFin)
                .OrderByDescending(v => v.Fecha)
                .ToListAsync();
        }
    }
}