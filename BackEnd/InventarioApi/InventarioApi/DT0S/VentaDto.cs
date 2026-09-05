using System.ComponentModel.DataAnnotations;

namespace InventarioApi.DTOs
{
    public class VentaDto
    {
        [Required]
        public int ClienteId { get; set; }

        public DateTime Fecha { get; set; }

        [Required]
        [MinLength(1)]
        public List<VentaDetalleDto> Detalles { get; set; } = new();
    }
}