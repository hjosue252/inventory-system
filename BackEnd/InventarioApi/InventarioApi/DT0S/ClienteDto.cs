using System.ComponentModel.DataAnnotations;

namespace InventarioApi.DTOs
{
    public class ClienteDto
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [StringLength(20)]
        public string Telefono { get; set; } = string.Empty;
    }
}