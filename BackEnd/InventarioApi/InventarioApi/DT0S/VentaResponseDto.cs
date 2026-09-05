namespace InventarioApi.DTOs
{
    public class VentaResponseDto
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public DateTime Fecha { get; set; }
        public string UsuarioId { get; set; } = string.Empty;
        public List<VentaDetalleDto> Detalles { get; set; } = new();
    }
}