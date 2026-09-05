using System.ComponentModel.DataAnnotations;

namespace InventarioApi.DTOs
{
    public class CompraDto
    {
        [Required]
        public int ProveedorId { get; set; }

        public DateTime Fecha { get; set; }

        [Required]
        [MinLength(1)]
        public List<CompraDetalleDto> Detalles { get; set; } = new();
    }
}