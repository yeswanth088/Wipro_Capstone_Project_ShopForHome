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
    public class UsersControllerTests
    {
        private ShopContext GetContext()
        {
            var options = new DbContextOptionsBuilder<ShopContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new ShopContext(options);
        }

        [Fact]
        public async Task GetUsers_ReturnsAll()
        {
            var db = GetContext();
            db.Users.Add(new User { UserId = 1, Name = "Test", Email = "t@t.com", Role = Role.User, Password = "1" });
            await db.SaveChangesAsync();

            var controller = new UsersController(db);
            var result = await controller.GetUsers();

            var items = Assert.IsAssignableFrom<IEnumerable<User>>(result.Value);
            Assert.Single(items);
        }

        [Fact]
        public async Task CreateUser_AddsToDb()
        {
            var db = GetContext();
            var controller = new UsersController(db);
            var user = new User { Name = "New", Email = "n@n.com", Role = Role.User, Password = "1" };

            var result = await controller.CreateUser(user);

            Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(1, db.Users.Count());
        }
    }
}
