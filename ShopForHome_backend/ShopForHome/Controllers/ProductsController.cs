using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;
using static ShopForHome.Permission.AdminOnly;

namespace ShopForHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ShopContext _context;

        public ProductsController(ShopContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet("Show")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                .Include(p => p.Category)
                .ToListAsync();
        }

        // GET: api/products/Search/5
        [HttpGet("Search/{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
                return NotFound();

            return product;
        }
        [AdminOnly]
        // POST: api/products/Create
        [HttpPost("Create")]
        public async Task<ActionResult<Product>> AddProduct(Product product, [FromQuery] int userId)
        {

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
        }

        // PUT: api/products/Update/5
        [AdminOnly]
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, Product product, [FromQuery] int userId)
        {
            if (id != product.ProductId)
                return BadRequest();

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.ProductId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/products/Delete/5
        [AdminOnly]
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteProduct(int id, [FromQuery] int userId)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}