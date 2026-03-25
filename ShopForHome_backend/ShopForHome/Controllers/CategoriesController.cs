using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ShopForHome.Models;
using static ShopForHome.Permission.AdminOnly;

namespace ShopForHome.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ShopContext _context;

        public CategoryController(ShopContext context)
        {
            _context = context;
        }

        [AdminOnly]
        [HttpPost("Create")]
        public async Task<IActionResult> Create(Category category, [FromQuery] int userId)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        [HttpGet("Show")]
        public async Task<IActionResult> Show()
        {
            return Ok(await _context.Categories.ToListAsync());
        }

        [AdminOnly]
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, Category category, [FromQuery] int userId)
        {
            if (id != category.CategoryId) return BadRequest();

            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok("Updated");
        }

        [AdminOnly]
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int userId)
        {
            var data = await _context.Categories.FindAsync(id);
            if (data == null) return NotFound();
            _context.Categories.Remove(data);
            await _context.SaveChangesAsync();

            return Ok("Deleted");
        }
    }
}

        