using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventarioApi.Migrations
{
    /// <inheritdoc />
    public partial class AddVentaDetalleRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "VentaId",
                table: "VentaDetalles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_VentaDetalles_VentaId",
                table: "VentaDetalles",
                column: "VentaId");

            migrationBuilder.AddForeignKey(
                name: "FK_VentaDetalles_Ventas_VentaId",
                table: "VentaDetalles",
                column: "VentaId",
                principalTable: "Ventas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VentaDetalles_Ventas_VentaId",
                table: "VentaDetalles");

            migrationBuilder.DropIndex(
                name: "IX_VentaDetalles_VentaId",
                table: "VentaDetalles");

            migrationBuilder.DropColumn(
                name: "VentaId",
                table: "VentaDetalles");
        }
    }
}
