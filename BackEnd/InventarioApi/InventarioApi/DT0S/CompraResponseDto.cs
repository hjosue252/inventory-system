namespace InventarioApi.DTOs
{
    public class CompraResponseDto
    {
        public int Id { get; set; }
        public int ProveedorId { get; set; }
        public DateTime Fecha { get; set; }
        public string UsuarioId { get; set; } = string.Empty;
        public List<CompraDetalleDto> Detalles { get; set; } = new();
    }
}