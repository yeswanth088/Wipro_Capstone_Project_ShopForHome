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
    public class ProductsControllerTests
    {
        private ShopContext GetContext()
        {
            var options = new DbContextOptionsBuilder<ShopContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new ShopContext(options);
        }

        [Fact]
        public async Task GetProducts_ReturnsAll()
        {
            var db = GetContext();
            var cat = new Category { CategoryId = 1, CategoryName = "Home" };
            db.Products.Add(new Product { ProductId = 1, ProductName = "Vase", Price = 10, CategoryId = 1, Category = cat, ImageUrl = "v.jpg" });
            await db.SaveChangesAsync();

            var controller = new ProductsController(db);
            var result = await controller.GetProducts();

            var items = Assert.IsAssignableFrom<IEnumerable<Product>>(result.Value);
            Assert.Single(items);
        }

        [Fact]
        public async Task AddProduct_AddsSuccessfully()
        {
            var db = GetContext();
            db.Users.Add(new User { UserId = 1, Role = Role.Admin, Email = "a@a.com", Name = "Admin", Password = "1" });
            await db.SaveChangesAsync();

            var controller = new ProductsController(db);
            var p = new Product { ProductName = "New", Price = 20, CategoryId = 1, ImageUrl = "n.jpg" };

            var result = await controller.AddProduct(p, 1);

            Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(1, db.Products.Count());
        }
    }
}
