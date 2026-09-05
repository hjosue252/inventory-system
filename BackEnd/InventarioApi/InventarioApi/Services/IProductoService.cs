using InventarioApi.DTOs;

namespace InventarioApi.Services
{
    public interface IProductoService
    {
        Task<IEnumerable<ProductoResponseDto>> GetAllAsync();

        Task<ProductoResponseDto?> GetByIdAsync(int id);

        Task<ProductoResponseDto> CreateAsync(ProductoDto dto);

        Task<bool> UpdateAsync(int id, ProductoDto dto);

        Task<bool> DeleteAsync(int id);
    }
}