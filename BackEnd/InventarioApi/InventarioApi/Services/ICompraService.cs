using InventarioApi.DTOs;

namespace InventarioApi.Services
{
    public interface ICompraService
    {
        Task<CompraResponseDto> CreateAsync(
            CompraDto dto,
            string usuarioId);

        Task<CompraResponseDto?> GetByIdAsync(int id);

        Task<IEnumerable<CompraResponseDto>> GetAllAsync();
    }
}