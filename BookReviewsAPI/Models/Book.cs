using System.ComponentModel.DataAnnotations;

namespace BookReviewsAPI.Models
{
    public class Book
    {
        public Book()
        {
            Reviews = new List<Review>();
            UserBooks = new List<UserBook>();
        }

        [Key]
        public int BookId { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Author { get; set; } = string.Empty;
        
        public string? ISBN { get; set; }
        public string? Description { get; set; }
        public string? CoverUrl { get; set; }
        public DateTime PublishedDate { get; set; }
        
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<UserBook> UserBooks { get; set; }
    }
}