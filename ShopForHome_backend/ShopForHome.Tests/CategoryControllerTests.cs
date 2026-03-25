using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Controllers;
using ShopForHome.Models;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopForHome.Tests
{
    public class CategoryControllerTests
    {
        private ShopContext GetContext()
        {
            var options = new DbContextOptionsBuilder<ShopContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new ShopContext(options);
        }

        [Fact]
        public async Task Show_ReturnsAllCategories()
        {
            var db = GetContext();
            db.Categories.Add(new Category { CategoryId = 1, CategoryName = "Home" });
            await db.SaveChangesAsync();

            var controller = new CategoryController(db);
            var result = await controller.Show();

            var okResult = Assert.IsType<OkObjectResult>(result);
            var items = Assert.IsAssignableFrom<IEnumerable<Category>>(okResult.Value);
            Assert.Single(items);
        }

        [Fact]
        public async Task Create_AddsCategory()
        {
            var db = GetContext();
            db.Users.Add(new User { UserId = 1, Role = Role.Admin, Email = "a@a.com", Name = "Admin", Password = "1" });
            await db.SaveChangesAsync();

            var controller = new CategoryController(db);
            var cat = new Category { CategoryName = "NewCat" };

            var result = await controller.Create(cat, 1);

            Assert.IsType<OkObjectResult>(result);
            Assert.Equal(1, db.Categories.Count());
        }
    }
}
