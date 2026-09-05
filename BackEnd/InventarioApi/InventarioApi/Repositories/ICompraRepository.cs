using InventarioApi.Models;

namespace InventarioApi.Repositories
{
    public interface ICompraRepository
    {
        Task AddAsync(Compra compra);
        Task<Compra?> GetByIdAsync(int id);
        Task<IEnumerable<Compra>> GetAllAsync();
        Task SaveChangesAsync();
    }
}