using InventarioApi.DTOs;
using InventarioApi.Repositories;

namespace InventarioApi.Services
{
    public class ReporteService : IReporteService
    {
        private readonly IReporteRepository _repository;

        public ReporteService(IReporteRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ReporteVentaDto>> GetVentasByDateRangeAsync(
            DateTime fechaInicio,
            DateTime fechaFin)
        {
            if (fechaInicio > fechaFin)
                throw new ArgumentException(
                    "La fecha de inicio no puede ser mayor que la fecha de fin.");

            var ventas = await _repository.GetVentasByDateRangeAsync(
                fechaInicio,
                fechaFin);

            return ventas.Select(v => new ReporteVentaDto
            {
                VentaId = v.Id,
                Fecha = v.Fecha,
                ClienteId = v.ClienteId,
                Cliente = v.Cliente.Nombre,
                CantidadProductos = v.Detalles.Sum(d => d.Cantidad),
                Total = v.Detalles.Sum(d => d.Cantidad * d.PrecioVenta)
            });
        }
    }
}