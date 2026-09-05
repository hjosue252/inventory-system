using InventarioApi.DTOs;
using InventarioApi.Models;
using InventarioApi.Repositories;

namespace InventarioApi.Services
{
    public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _repository;

        public ProductoService(IProductoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProductoResponseDto>> GetAllAsync()
        {
            var productos = await _repository.GetAllAsync();

            return productos.Select(p => new ProductoResponseDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion,
                PrecioUnitario = p.PrecioUnitario,
                Stock = p.Stock
            });
        }

        public async Task<ProductoResponseDto?> GetByIdAsync(int id)
        {
            var producto = await _repository.GetByIdAsync(id);

            if (producto == null)
                return null;

            return new ProductoResponseDto
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                Descripcion = producto.Descripcion,
                PrecioUnitario = producto.PrecioUnitario,
                Stock = producto.Stock
            };
        }

        public async Task<ProductoResponseDto> CreateAsync(ProductoDto dto)
        {
            var producto = new Producto
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                PrecioUnitario = dto.PrecioUnitario,
                Stock = dto.Stock
            };

            await _repository.AddAsync(producto);
            await _repository.SaveChangesAsync();

            return new ProductoResponseDto
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                Descripcion = producto.Descripcion,
                PrecioUnitario = producto.PrecioUnitario,
                Stock = producto.Stock
            };
        }

        public async Task<bool> UpdateAsync(int id, ProductoDto dto)
        {
            var producto = await _repository.GetByIdAsync(id);

            if (producto == null)
                return false;

            producto.Nombre = dto.Nombre;
            producto.Descripcion = dto.Descripcion;
            producto.PrecioUnitario = dto.PrecioUnitario;
            producto.Stock = dto.Stock;

            _repository.Update(producto);
            await _repository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var producto = await _repository.GetByIdAsync(id);

            if (producto == null)
                return false;

            _repository.Delete(producto);
            await _repository.SaveChangesAsync();

            return true;
        }
    }
}