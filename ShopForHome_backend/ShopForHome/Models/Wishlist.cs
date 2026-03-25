using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopForHome.Models
{
    public class Wishlist
    {
        [Key]
        public int WishlistId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }
        [JsonIgnore]
        public Product? Product { get; set; }
    }
}
