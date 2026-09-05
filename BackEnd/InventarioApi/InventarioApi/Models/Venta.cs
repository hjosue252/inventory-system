namespace InventarioApi.Models
{
    public class Venta
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }

        public Cliente Cliente { get; set; } = null!;

        public DateTime Fecha { get; set; }

        public string UsuarioId { get; set; } = string.Empty;

        public ICollection<VentaDetalle> Detalles { get; set; } = new List<VentaDetalle>();
    }
}