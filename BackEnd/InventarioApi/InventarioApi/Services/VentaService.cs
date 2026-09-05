using InventarioApi.DTOs;
using InventarioApi.Models;
using InventarioApi.Repositories;

namespace InventarioApi.Services
{
    public class VentaService : IVentaService
    {
        private readonly IVentaRepository _ventaRepository;
        private readonly IProductoRepository _productoRepository;
        private readonly IClienteRepository _clienteRepository;

        public VentaService(
            IVentaRepository ventaRepository,
            IProductoRepository productoRepository,
            IClienteRepository clienteRepository)
        {
            _ventaRepository = ventaRepository;
            _productoRepository = productoRepository;
            _clienteRepository = clienteRepository;
        }

        public async Task<VentaResponseDto> CreateAsync(
            VentaDto dto,
            string usuarioId)
        {
            var cliente = await _clienteRepository
                .GetByIdAsync(dto.ClienteId);

            if (cliente == null)
            {
                throw new KeyNotFoundException(
                    $"El cliente con Id {dto.ClienteId} no existe.");
            }

            var venta = new Venta
            {
                ClienteId = dto.ClienteId,
                Fecha = dto.Fecha == default
                    ? DateTime.Now
                    : dto.Fecha,
                UsuarioId = usuarioId
            };

            foreach (var detalleDto in dto.Detalles)
            {
                var producto = await _productoRepository
                    .GetByIdAsync(detalleDto.ProductoId);

                if (producto == null)
                {
                    throw new KeyNotFoundException(
                        $"El producto con Id {detalleDto.ProductoId} no existe.");
                }

                if (producto.Stock < detalleDto.Cantidad)
                {
                    throw new InvalidOperationException(
                        $"Stock insuficiente para el producto '{producto.Nombre}'. " +
                        $"Stock disponible: {producto.Stock}. " +
                        $"Cantidad solicitada: {detalleDto.Cantidad}.");
                }

                producto.Stock -= detalleDto.Cantidad;

                venta.Detalles.Add(new VentaDetalle
                {
                    ProductoId = detalleDto.ProductoId,
                    Cantidad = detalleDto.Cantidad,
                    PrecioVenta = detalleDto.PrecioVenta
                });
            }

            await _ventaRepository.AddAsync(venta);
            await _ventaRepository.SaveChangesAsync();

            return MapToResponse(venta);
        }

        public async Task<VentaResponseDto?> GetByIdAsync(int id)
        {
            var venta = await _ventaRepository.GetByIdAsync(id);

            if (venta == null)
                return null;

            return MapToResponse(venta);
        }

        public async Task<IEnumerable<VentaResponseDto>> GetAllAsync()
        {
            var ventas = await _ventaRepository.GetAllAsync();

            return ventas.Select(MapToResponse);
        }

        private static VentaResponseDto MapToResponse(Venta venta)
        {
            return new VentaResponseDto
            {
                Id = venta.Id,
                ClienteId = venta.ClienteId,
                Fecha = venta.Fecha,
                UsuarioId = venta.UsuarioId,
                Detalles = venta.Detalles.Select(d =>
                    new VentaDetalleDto
                    {
                        ProductoId = d.ProductoId,
                        Cantidad = d.Cantidad,
                        PrecioVenta = d.PrecioVenta
                    }).ToList()
            };
        }
    }
}