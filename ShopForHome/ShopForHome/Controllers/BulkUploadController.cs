using Microsoft.AspNetCore.Mvc;
using ShopForHome.Models;

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

        [HttpPost("UploadCSV")]
        public async Task<IActionResult> UploadCSV(int userId, IFormFile file)
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

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();

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