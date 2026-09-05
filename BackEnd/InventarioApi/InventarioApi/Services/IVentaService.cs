using InventarioApi.DTOs;

namespace InventarioApi.Services
{
    public interface IVentaService
    {
        Task<VentaResponseDto> CreateAsync(
            VentaDto dto,
            string usuarioId);

        Task<VentaResponseDto?> GetByIdAsync(int id);

        Task<IEnumerable<VentaResponseDto>> GetAllAsync();
    }
}