using Microsoft.AspNetCore.Mvc;
using ShopForHome.Models;
using static ShopForHome.Permission.AdminOnly;

namespace ShopForHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BulkUploadController : ControllerBase
    {
        private readonly ShopContext _context;

        public BulkUploadController(ShopContext context)
        {
            _context = context;
        }

        [AdminOnly]
        [HttpPost("UploadCSV")]
        public async Task<IActionResult> UploadCSV([FromQuery] int userId, IFormFile file)
        {
            
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return BadRequest("User not found");

           
            if (user.Role != Role.Admin)
                return Unauthorized("You do not have permission to upload products");

            
            if (file == null || file.Length == 0)
                return BadRequest("CSV file not provided");

            using var reader = new StreamReader(file.OpenReadStream());

            bool firstRow = true;

            string? line;
            while ((line = await reader.ReadLineAsync()) != null)
            {

                if (firstRow)
                {
                    firstRow = false;
                    continue;
                }

                var values = line.Split(',');

                Product product = new Product
                {
                    ProductName = values[0],
                    Price = Convert.ToDouble(values[1]),
                    Quantity = Convert.ToInt32(values[2]),
                    Stock = Enum.Parse<Stock>(values[3], true),
                    Rating = Convert.ToDouble(values[4]),
                    ImageUrl = values[5],
                    CategoryId = Convert.ToInt32(values[6])
                };

                _context.Products.Add(product);
            }

            await _context.SaveChangesAsync();

            return Ok("Products uploaded successfully");
        }
    }
}