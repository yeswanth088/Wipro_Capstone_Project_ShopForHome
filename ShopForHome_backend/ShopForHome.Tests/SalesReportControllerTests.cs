using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Controllers;
using ShopForHome.Models;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopForHome.Tests
{
    public class SalesReportControllerTests
    {
        private ShopContext GetContext()
        {
            var options = new DbContextOptionsBuilder<ShopContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new ShopContext(options);
        }

        [Fact]
        public async Task GetSalesReport_ReturnsOk()
        {
            var db = GetContext();
            db.Users.Add(new User { UserId = 1, Role = Role.Admin, Email = "a@a.com", Name = "Admin", Password = "1" });
            await db.SaveChangesAsync();

            var controller = new SalesReportController(db);
            var start = new DateOnly(2026, 3, 1);
            var end = new DateOnly(2026, 3, 31);

            var result = controller.GetSalesReport(start, end, 1);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
