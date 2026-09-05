using InventarioApi.DTOs;

namespace InventarioApi.Services
{
    public interface IProveedorService
    {
        Task<IEnumerable<ProveedorResponseDto>> GetAllAsync();
        Task<ProveedorResponseDto?> GetByIdAsync(int id);
        Task<ProveedorResponseDto> CreateAsync(ProveedorDto dto);
        Task<bool> UpdateAsync(int id, ProveedorDto dto);
        Task<bool> DeleteAsync(int id);
    }
}