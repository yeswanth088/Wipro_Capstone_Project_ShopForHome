using Microsoft.EntityFrameworkCore;

namespace ShopForHome.Models
{
    public class ShopContext:DbContext
    {
        public ShopContext(DbContextOptions<ShopContext> op) : base(op) { }
        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Product> Products { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<Wishlist> Wishlists { get; set; }

        public DbSet<Coupon> Coupons { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .Property(p => p.Stock)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(p => p.Role)
                .HasConversion<string>();
        }
        
    }
}
