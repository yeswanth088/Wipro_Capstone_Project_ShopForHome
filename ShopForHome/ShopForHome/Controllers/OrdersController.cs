using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;

namespace ShopForHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ShopContext _context;

        public OrdersController(ShopContext context)
        {
            _context = context;
        }

        // GET orders by user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .ToListAsync();
        }

        // Place order
        [HttpPost("PlaceOrder")]
        public async Task<IActionResult> PlaceOrder(Order order)
        {
            order.OrderDate = DateTime.Now;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            
            var items = _context.OrderItems
                .Where(i => i.OrderId == order.OrderId)
                .ToList();

            foreach (var item in items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);

                if (product == null)
                    continue;

                product.Quantity -= item.Quantity;

                
                if (product.Quantity <= 0)
                {
                    product.Stock = Stock.OutOFStock;
                    product.Quantity = 0;
                }

                // Low stock alert
                if (product.Quantity < 10)
                {
                    Console.WriteLine($"⚠️ Admin Alert: Stock for {product.ProductName} is below 10.");
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully" });
        }
    }
}