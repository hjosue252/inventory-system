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
    public class ComprasController : ControllerBase
    {
        private readonly ICompraService _service;

        public ComprasController(ICompraService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompraResponseDto>>> GetAll()
        {
            var compras = await _service.GetAllAsync();

            return Ok(compras);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CompraResponseDto>> GetById(int id)
        {
            var compra = await _service.GetByIdAsync(id);

            if (compra == null)
                return NotFound();

            return Ok(compra);
        }

        [HttpPost]
        public async Task<ActionResult<CompraResponseDto>> Create(
            CompraDto dto)
        {
            try
            {
                var usuarioId = User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(usuarioId))
                    return Unauthorized();

                var compra = await _service.CreateAsync(
                    dto,
                    usuarioId);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = compra.Id },
                    compra);
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}