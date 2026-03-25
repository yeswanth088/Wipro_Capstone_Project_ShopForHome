using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public IActionResult GetSalesReport([FromQuery] DateOnly start, [FromQuery] DateOnly end, [FromQuery] int userId)
        {
            // Convert DateOnly to DateTime for filtering at the bounds
            var startDate = start.ToDateTime(TimeOnly.MinValue);
            var endDate = end.ToDateTime(TimeOnly.MaxValue);

            var reportData = _context.OrderItems
                .Include(oi => oi.Order)
                .Include(oi => oi.Product)
                .Where(oi => oi.Order!.OrderDate >= startDate && oi.Order!.OrderDate <= endDate)
                .ToList() // evaluate client side for grouping
                .GroupBy(oi => new { oi.Order!.OrderDate.Date, oi.Product!.ProductName })
                .Select(g => new
                {
                    Date = g.Key.Date.ToString("yyyy-MM-dd"),
                    Product = g.Key.ProductName ?? "Unknown Product",
                    Qty = g.Sum(oi => oi.Quantity),
                    Revenue = g.Sum(oi => oi.Quantity * oi.Product!.Price)
                })
                .OrderBy(x => x.Date)
                .ToList();

            var totalRevenue = reportData.Sum(x => x.Revenue);

            return Ok(new
            {
                ReportData = reportData,
                TotalRevenue = totalRevenue
            });
        }
    }
}