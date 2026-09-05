using System.ComponentModel.DataAnnotations;

namespace InventarioApi.DTOs
{
    public class ProductoDto
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(500)]
        public string Descripcion { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal PrecioUnitario { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
    }
}