using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopForHome.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        public string? ProductName { get; set; }

        public double Price { get; set; }
        public int Quantity { get; set; }

        public Stock Stock { get; set; }

        public double Rating { get; set; }

        public string? ImageUrl { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        
        public Category? Category { get; set; }
    }
}