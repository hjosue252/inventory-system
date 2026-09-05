using InventarioApi.Models;

namespace InventarioApi.Repositories
{
    public interface IVentaRepository
    {
        Task AddAsync(Venta venta);
        Task<Venta?> GetByIdAsync(int id);
        Task<IEnumerable<Venta>> GetAllAsync();
        Task SaveChangesAsync();
    }
}