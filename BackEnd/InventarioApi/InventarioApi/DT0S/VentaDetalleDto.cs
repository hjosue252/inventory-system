using System.ComponentModel.DataAnnotations;

namespace InventarioApi.DTOs
{
    public class VentaDetalleDto
    {
        [Required]
        public int ProductoId { get; set; }

        [Range(1, int.MaxValue)]
        public int Cantidad { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal PrecioVenta { get; set; }
    }
}