using InventarioApi.Models;

namespace InventarioApi.Repositories
{
    public interface IReporteRepository
    {
        Task<IEnumerable<Venta>> GetVentasByDateRangeAsync(
            DateTime fechaInicio,
            DateTime fechaFin);
    }
}