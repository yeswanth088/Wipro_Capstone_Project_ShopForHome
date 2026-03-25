using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ShopForHome.Models
{
    public class Coupon
    {
        [Key]
        public int CouponId { get; set; }

        public string? Code { get; set; }

        public int DiscountPercentage { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }
    }
}
