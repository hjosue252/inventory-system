namespace InventarioApi.Models
{
    public class Producto
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public decimal PrecioUnitario { get; set; }

        public int Stock { get; set; }
    }
}