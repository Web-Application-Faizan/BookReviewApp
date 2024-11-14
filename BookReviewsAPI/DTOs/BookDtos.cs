namespace BookReviewsAPI.DTOs
{
    public class CreateBookDto
    {
        public required string Title { get; set; }
        public required string Author { get; set; }
        public string? ISBN { get; set; }
        public string? Description { get; set; }
        public string? CoverUrl { get; set; }
        public DateTime PublishedDate { get; set; }
    }

    public class UpdateBookDto
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public string? ISBN { get; set; }
        public string? Description { get; set; }
        public string? CoverUrl { get; set; }
        public DateTime? PublishedDate { get; set; }
    }

    public class BookDto
    {
        public int BookId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string? ISBN { get; set; }
        public string? Description { get; set; }
        public string? CoverUrl { get; set; }
        public DateTime PublishedDate { get; set; }
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }
}