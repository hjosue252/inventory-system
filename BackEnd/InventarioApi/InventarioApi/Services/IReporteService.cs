using InventarioApi.DTOs;

namespace InventarioApi.Services
{
    public interface IReporteService
    {
        Task<IEnumerable<ReporteVentaDto>> GetVentasByDateRangeAsync(
            DateTime fechaInicio,
            DateTime fechaFin);
    }
}