using InventarioApi.DTOs;
using InventarioApi.Models;
using InventarioApi.Repositories;

namespace InventarioApi.Services
{
    public class ClienteService : IClienteService
    {
        private readonly IClienteRepository _repository;

        public ClienteService(IClienteRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ClienteResponseDto>> GetAllAsync()
        {
            var clientes = await _repository.GetAllAsync();

            return clientes.Select(c => new ClienteResponseDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Email = c.Email,
                Telefono = c.Telefono
            });
        }

        public async Task<ClienteResponseDto?> GetByIdAsync(int id)
        {
            var cliente = await _repository.GetByIdAsync(id);

            if (cliente == null)
                return null;

            return new ClienteResponseDto
            {
                Id = cliente.Id,
                Nombre = cliente.Nombre,
                Email = cliente.Email,
                Telefono = cliente.Telefono
            };
        }

        public async Task<ClienteResponseDto> CreateAsync(ClienteDto dto)
        {
            var cliente = new Cliente
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Telefono = dto.Telefono
            };

            await _repository.AddAsync(cliente);
            await _repository.SaveChangesAsync();

            return new ClienteResponseDto
            {
                Id = cliente.Id,
                Nombre = cliente.Nombre,
                Email = cliente.Email,
                Telefono = cliente.Telefono
            };
        }

        public async Task<bool> UpdateAsync(int id, ClienteDto dto)
        {
            var cliente = await _repository.GetByIdAsync(id);

            if (cliente == null)
                return false;

            cliente.Nombre = dto.Nombre;
            cliente.Email = dto.Email;
            cliente.Telefono = dto.Telefono;

            _repository.Update(cliente);
            await _repository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cliente = await _repository.GetByIdAsync(id);

            if (cliente == null)
                return false;

            _repository.Delete(cliente);
            await _repository.SaveChangesAsync();

            return true;
        }
    }
}