using InventarioApi.DTOs;
using InventarioApi.Models;
using InventarioApi.Repositories;

namespace InventarioApi.Services
{
    public class ProveedorService : IProveedorService
    {
        private readonly IProveedorRepository _repository;

        public ProveedorService(IProveedorRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ProveedorResponseDto>> GetAllAsync()
        {
            var proveedores = await _repository.GetAllAsync();

            return proveedores.Select(p => new ProveedorResponseDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Email = p.Email,
                Telefono = p.Telefono
            });
        }

        public async Task<ProveedorResponseDto?> GetByIdAsync(int id)
        {
            var proveedor = await _repository.GetByIdAsync(id);

            if (proveedor == null)
                return null;

            return new ProveedorResponseDto
            {
                Id = proveedor.Id,
                Nombre = proveedor.Nombre,
                Email = proveedor.Email,
                Telefono = proveedor.Telefono
            };
        }

        public async Task<ProveedorResponseDto> CreateAsync(ProveedorDto dto)
        {
            var proveedor = new Proveedor
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono
            };

            await _repository.AddAsync(proveedor);
            await _repository.SaveChangesAsync();

            return new ProveedorResponseDto
            {
                Id = proveedor.Id,
                Nombre = proveedor.Nombre,
                Email = proveedor.Email,
                Telefono = proveedor.Telefono
            };
        }

        public async Task<bool> UpdateAsync(int id, ProveedorDto dto)
        {
            var proveedor = await _repository.GetByIdAsync(id);

            if (proveedor == null)
                return false;

            proveedor.Nombre = dto.Nombre;
            proveedor.Email = dto.Email;
            proveedor.Telefono = dto.Telefono;

            _repository.Update(proveedor);
            await _repository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var proveedor = await _repository.GetByIdAsync(id);

            if (proveedor == null)
                return false;

            _repository.Delete(proveedor);
            await _repository.SaveChangesAsync();

            return true;
        }
    }
}