using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;

namespace ShopForHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly ShopContext _context;

        public WishlistController(ShopContext context)
        {
            _context = context;
        }

        // GET wishlist by user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Wishlist>>> GetWishlist(int userId)
        {
            return await _context.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .ToListAsync();
        }

        // Add to wishlist
        [HttpPost("add")]
        public async Task<ActionResult<Wishlist>> AddWishlist(Wishlist wishlist)
        {
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();

            return Ok(wishlist);
        }

        // Remove wishlist item
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveWishlist(int id)
        {
            var item = await _context.Wishlists.FindAsync(id);

            if (item == null)
                return NotFound();

            _context.Wishlists.Remove(item);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}