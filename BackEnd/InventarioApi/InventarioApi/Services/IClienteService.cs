using InventarioApi.DTOs;

namespace InventarioApi.Services
{
    public interface IClienteService
    {
        Task<IEnumerable<ClienteResponseDto>> GetAllAsync();
        Task<ClienteResponseDto?> GetByIdAsync(int id);
        Task<ClienteResponseDto> CreateAsync(ClienteDto dto);
        Task<bool> UpdateAsync(int id, ClienteDto dto);
        Task<bool> DeleteAsync(int id);
    }
}