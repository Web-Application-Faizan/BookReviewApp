using System.ComponentModel.DataAnnotations;

namespace BookReviewsAPI.Models
{
    public class UserBook
    {
        [Key]
        public int UserBookId { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public string Status { get; set; } = "Want to Read"; // Default value
        public string Format { get; set; } = "Paperback"; // Default value
        public DateTime AddedAt { get; set; }
        
        public virtual User? User { get; set; }
        public virtual Book? Book { get; set; }
    }
}