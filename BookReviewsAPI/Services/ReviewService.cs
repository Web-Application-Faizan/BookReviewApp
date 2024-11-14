using Microsoft.EntityFrameworkCore;
using BookReviewsAPI.Data;
using BookReviewsAPI.DTOs;
using BookReviewsAPI.Models;

namespace BookReviewsAPI.Services
{
    public class ReviewService
    {
        private readonly AppDbContext _context;
        private readonly BookService _bookService;

        public ReviewService(AppDbContext context, BookService bookService)
        {
            _context = context;
            _bookService = bookService;
        }

        public async Task<List<ReviewDto>> GetBookReviews(int bookId)
        {
            return await _context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .Select(r => new ReviewDto
                {
                    ReviewId = r.ReviewId,
                    BookId = r.BookId,
                    UserId = r.UserId,
                    UserName = r.User.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Format = r.Format,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<ReviewDto>> GetUserReviews(int userId)
        {
            return await _context.Reviews
                .Where(r => r.UserId == userId)
                .Include(r => r.Book)
                .Select(r => new ReviewDto
                {
                    ReviewId = r.ReviewId,
                    BookId = r.BookId,
                    UserId = r.UserId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Format = r.Format,
                    CreatedAt = r.CreatedAt,
                    Book = new BookDto
                    {
                        BookId = r.Book.BookId,
                        Title = r.Book.Title,
                        Author = r.Book.Author,
                        ISBN = r.Book.ISBN,
                        CoverUrl = r.Book.CoverUrl
                    }
                })
                .ToListAsync();
        }

        public async Task<ReviewDto?> CreateReview(int userId, CreateReviewDto createReviewDto)
        {
            // Check if user has already reviewed this book
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.BookId == createReviewDto.BookId && r.UserId == userId);

            if (existingReview != null)
            {
                return null; // User has already reviewed this book
            }

            var review = new Review
            {
                BookId = createReviewDto.BookId,
                UserId = userId,
                Rating = createReviewDto.Rating,
                Comment = createReviewDto.Comment,
                Format = createReviewDto.Format,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Create UserBook entry if it doesn't exist
            var userBook = await _context.UserBooks
                .FirstOrDefaultAsync(ub => ub.BookId == createReviewDto.BookId && ub.UserId == userId);

            if (userBook == null)
            {
                userBook = new UserBook
                {
                    UserId = userId,
                    BookId = createReviewDto.BookId,
                    Status = "Completed",
                    Format = createReviewDto.Format,
                    AddedAt = DateTime.UtcNow
                };
                _context.UserBooks.Add(userBook);
                await _context.SaveChangesAsync();
            }

            return new ReviewDto
            {
                ReviewId = review.ReviewId,
                BookId = review.BookId,
                UserId = review.UserId,
                Rating = review.Rating,
                Comment = review.Comment,
                Format = review.Format,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<ReviewDto?> UpdateReview(int reviewId, int userId, UpdateReviewDto updateReviewDto)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId && r.UserId == userId);

            if (review == null) return null;

            review.Rating = updateReviewDto.Rating;
            review.Comment = updateReviewDto.Comment;
            review.Format = updateReviewDto.Format;

            await _context.SaveChangesAsync();

            return new ReviewDto
            {
                ReviewId = review.ReviewId,
                BookId = review.BookId,
                UserId = review.UserId,
                Rating = review.Rating,
                Comment = review.Comment,
                Format = review.Format,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<bool> DeleteReview(int reviewId, int userId)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId && r.UserId == userId);

            if (review == null) return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}