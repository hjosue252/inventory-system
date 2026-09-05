namespace InventarioApi.Models
{
    public class CompraDetalle
    {
        public int Id { get; set; }

        public int CompraId { get; set; }

        public Compra Compra { get; set; } = null!;

        public int ProductoId { get; set; }

        public Producto Producto { get; set; } = null!;

        public int Cantidad { get; set; }

        public decimal PrecioCompra { get; set; }
    }
}