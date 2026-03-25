using System.ComponentModel.DataAnnotations;

namespace ShopForHome.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public string? Email { get; set; }

        public string? Password { get; set; }

        public Role Role { get; set; }
    }
}
