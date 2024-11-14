namespace BookReviewsAPI.DTOs
{
    public class UpdateProfileDto
    {
        public string? Name { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
    }

    public class UserProfileDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public ReadingStatsDto ReadingStats { get; set; } = new();
    }

    public class ReadingStatsDto
    {
        public int TotalBooksRead { get; set; }
        public int CurrentlyReading { get; set; }
        public int WantToRead { get; set; }
        public Dictionary<string, int> FormatBreakdown { get; set; } = new();
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }

    public class UserBookDto
    {
        public int BookId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public DateTime AddedAt { get; set; }
        public string? CoverUrl { get; set; }
    }

    public class AddUserBookDto
    {
        public int BookId { get; set; }
        public string Status { get; set; } = "Want to Read";
        public string Format { get; set; } = "Paperback";
    }

    public class UpdateUserBookDto
    {
        public string Status { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
    }
}