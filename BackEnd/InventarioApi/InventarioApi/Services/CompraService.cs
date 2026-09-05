using InventarioApi.DTOs;
using InventarioApi.Models;
using InventarioApi.Repositories;

namespace InventarioApi.Services
{
    public class CompraService : ICompraService
    {
        private readonly ICompraRepository _compraRepository;
        private readonly IProductoRepository _productoRepository;

        public CompraService(
            ICompraRepository compraRepository,
            IProductoRepository productoRepository)
        {
            _compraRepository = compraRepository;
            _productoRepository = productoRepository;
        }

        public async Task<CompraResponseDto> CreateAsync(
            CompraDto dto,
            string usuarioId)
        {
            var compra = new Compra
            {
                ProveedorId = dto.ProveedorId,
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

                producto.Stock += detalleDto.Cantidad;

                compra.Detalles.Add(new CompraDetalle
                {
                    ProductoId = detalleDto.ProductoId,
                    Cantidad = detalleDto.Cantidad,
                    PrecioCompra = detalleDto.PrecioCompra
                });
            }

            await _compraRepository.AddAsync(compra);
            await _compraRepository.SaveChangesAsync();

            return MapToResponse(compra);
        }

        public async Task<CompraResponseDto?> GetByIdAsync(int id)
        {
            var compra = await _compraRepository.GetByIdAsync(id);

            if (compra == null)
                return null;

            return MapToResponse(compra);
        }

        public async Task<IEnumerable<CompraResponseDto>> GetAllAsync()
        {
            var compras = await _compraRepository.GetAllAsync();

            return compras.Select(MapToResponse);
        }

        private static CompraResponseDto MapToResponse(Compra compra)
        {
            return new CompraResponseDto
            {
                Id = compra.Id,
                ProveedorId = compra.ProveedorId,
                Fecha = compra.Fecha,
                UsuarioId = compra.UsuarioId,
                Detalles = compra.Detalles.Select(d =>
                    new CompraDetalleDto
                    {
                        ProductoId = d.ProductoId,
                        Cantidad = d.Cantidad,
                        PrecioCompra = d.PrecioCompra
                    }).ToList()
            };
        }
    }
}