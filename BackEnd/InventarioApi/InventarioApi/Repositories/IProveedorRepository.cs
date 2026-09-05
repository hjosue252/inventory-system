using InventarioApi.Models;

namespace InventarioApi.Repositories
{
    public interface IProveedorRepository
    {
        Task<IEnumerable<Proveedor>> GetAllAsync();
        Task<Proveedor?> GetByIdAsync(int id);
        Task AddAsync(Proveedor proveedor);
        void Update(Proveedor proveedor);
        void Delete(Proveedor proveedor);
        Task SaveChangesAsync();
    }
}