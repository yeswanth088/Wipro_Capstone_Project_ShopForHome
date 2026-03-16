using Microsoft.AspNetCore.Mvc;
using ShopForHome.Models;
using static ShopForHome.Permission.AdminOnly;

namespace ShopForHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesReportController : ControllerBase
    {
        private readonly ShopContext _context;

        public SalesReportController(ShopContext context)
        {
            _context = context;
        }
        [AdminOnly]
        [HttpGet]
        public IActionResult GetSalesReport(DateTime start, DateTime end)
        {
            var orders = _context.Orders
                .Where(o => o.OrderDate >= start && o.OrderDate <= end)
                .ToList();

            var totalSales = orders.Sum(o => o.TotalAmount);

            return Ok(new
            {
                Orders = orders.Count,
                TotalSales = totalSales
            });
        }
    }
}