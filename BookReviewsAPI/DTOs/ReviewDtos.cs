namespace BookReviewsAPI.DTOs
{
    public class CreateReviewDto
    {
        public int BookId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string Format { get; set; } = "Paperback";
    }

    public class UpdateReviewDto
    {
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string Format { get; set; } = "Paperback";
    }

    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public string Format { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public BookDto? Book { get; set; }
    }
}