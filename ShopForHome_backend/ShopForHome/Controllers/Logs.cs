using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;

namespace ShopForHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly ShopContext _context;

        public LogsController(ShopContext context)
        {
            _context = context;
        }

        // LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email && u.Password == password);

            if (user == null)
                return Unauthorized("Invalid Email or Password");

            return Ok(new
            {
                Message = "Login Successful",
                UserId = user.UserId,
                Role = user.Role
            });
        }
    }
}