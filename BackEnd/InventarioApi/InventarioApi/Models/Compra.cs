namespace InventarioApi.Models
{
    public class Compra
    {
        public int Id { get; set; }

        public int ProveedorId { get; set; }

        public Proveedor Proveedor { get; set; } = null!;

        public DateTime Fecha { get; set; }

        public string UsuarioId { get; set; } = string.Empty;

        public ICollection<CompraDetalle> Detalles { get; set; } = new List<CompraDetalle>();
    }
}