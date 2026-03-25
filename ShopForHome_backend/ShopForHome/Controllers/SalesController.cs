using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;

namespace ShopForHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ShopContext _context;

        public SearchController(ShopContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> Search(
            string? category,
            double? price,
            double? rating)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(p => p.Category!.CategoryName == category);

            if (price.HasValue)
                query = query.Where(p => p.Price <= price);

            if (rating.HasValue)
                query = query.Where(p => p.Rating >= rating);

            return await query.ToListAsync();
        }
    }
}