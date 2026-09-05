using InventarioApi.Models;

namespace InventarioApi.Repositories
{
    public interface IClienteRepository
    {
        Task<IEnumerable<Cliente>> GetAllAsync();
        Task<Cliente?> GetByIdAsync(int id);
        Task AddAsync(Cliente cliente);
        void Update(Cliente cliente);
        void Delete(Cliente cliente);
        Task SaveChangesAsync();
    }
}