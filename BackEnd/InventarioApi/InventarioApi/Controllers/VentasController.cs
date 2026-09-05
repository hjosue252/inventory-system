using System.Security.Claims;
using InventarioApi.DTOs;
using InventarioApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventarioApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VentasController : ControllerBase
    {
        private readonly IVentaService _service;

        public VentasController(IVentaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VentaResponseDto>>> GetAll()
        {
            var ventas = await _service.GetAllAsync();

            return Ok(ventas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VentaResponseDto>> GetById(int id)
        {
            var venta = await _service.GetByIdAsync(id);

            if (venta == null)
                return NotFound();

            return Ok(venta);
        }

        [HttpPost]
        public async Task<ActionResult<VentaResponseDto>> Create(
            VentaDto dto)
        {
            try
            {
                var usuarioId = User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(usuarioId))
                    return Unauthorized();

                var venta = await _service.CreateAsync(
                    dto,
                    usuarioId);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = venta.Id },
                    venta);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}