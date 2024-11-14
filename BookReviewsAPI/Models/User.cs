using System.ComponentModel.DataAnnotations;

namespace BookReviewsAPI.Models
{
    public class User
    {
        public User()
        {
            Reviews = new List<Review>();
            UserBooks = new List<UserBook>();
        }

        [Key]
        public int UserId { get; set; }
        
        [Required]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        public string Name { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<UserBook> UserBooks { get; set; }
    }
}