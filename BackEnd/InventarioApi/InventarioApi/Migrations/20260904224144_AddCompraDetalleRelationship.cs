using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventarioApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCompraDetalleRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompraId",
                table: "CompraDetalles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_CompraDetalles_CompraId",
                table: "CompraDetalles",
                column: "CompraId");

            migrationBuilder.AddForeignKey(
                name: "FK_CompraDetalles_Compras_CompraId",
                table: "CompraDetalles",
                column: "CompraId",
                principalTable: "Compras",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompraDetalles_Compras_CompraId",
                table: "CompraDetalles");

            migrationBuilder.DropIndex(
                name: "IX_CompraDetalles_CompraId",
                table: "CompraDetalles");

            migrationBuilder.DropColumn(
                name: "CompraId",
                table: "CompraDetalles");
        }
    }
}
