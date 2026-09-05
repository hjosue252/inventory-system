using InventarioApi.Models;

namespace InventarioApi.Repositories
{
    public interface IProductoRepository
    {
        Task<IEnumerable<Producto>> GetAllAsync();

        Task<Producto?> GetByIdAsync(int id);

        Task AddAsync(Producto producto);

        void Update(Producto producto);

        void Delete(Producto producto);

        Task SaveChangesAsync();
    }
}