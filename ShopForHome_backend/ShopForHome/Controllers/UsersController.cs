using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;
using static ShopForHome.Permission.AdminOnly;

namespace ShopForHome.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly ShopContext _context;

        public UsersController(ShopContext context)
        {
            _context = context;
        }

        // GET all users
        [HttpGet("SHOW")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET user by id
        [HttpGet("SEARCH")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            return user;
        }

        // CREATE user
        [HttpPost("CREATE")]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            try
            {
                if (user == null) return BadRequest(new { message = "User data is missing" });
                
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email is registered already" });
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"CreateUser error: {ex.Message}");
                if (ex.InnerException != null) Console.WriteLine($"Inner: {ex.InnerException.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }
        [AdminOnly]
        // UPDATE user
        [HttpPut("UPDATE")]
        public async Task<IActionResult> UpdateUser([FromQuery] int id, User user, [FromQuery] int userId)
        {
            if (id != user.UserId)
                return BadRequest();

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE user
        [AdminOnly]
        [HttpDelete("DELETE")]
        public async Task<IActionResult> DeleteUser([FromQuery] int id, [FromQuery] int userId)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("Deleted");
        }
    }
}