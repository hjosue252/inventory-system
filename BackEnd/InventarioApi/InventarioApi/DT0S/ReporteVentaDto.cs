namespace InventarioApi.DTOs
{
    public class ReporteVentaDto
    {
        public int VentaId { get; set; }
        public DateTime Fecha { get; set; }
        public int ClienteId { get; set; }
        public string Cliente { get; set; } = string.Empty;
        public int CantidadProductos { get; set; }
        public decimal Total { get; set; }
    }
}