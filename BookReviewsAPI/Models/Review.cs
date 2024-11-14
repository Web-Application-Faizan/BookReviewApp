using System.ComponentModel.DataAnnotations;

namespace BookReviewsAPI.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        
        [Required]
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string Format { get; set; } = "Paperback"; // Default value
        public DateTime CreatedAt { get; set; }
        
        public virtual Book? Book { get; set; }
        public virtual User? User { get; set; }
    }
}