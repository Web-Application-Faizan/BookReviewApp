using Microsoft.EntityFrameworkCore;
using BookReviewsAPI.Data;
using BookReviewsAPI.DTOs;
using BookReviewsAPI.Models;

namespace BookReviewsAPI.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfileDto?> GetUserProfile(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Reviews)
                .Include(u => u.UserBooks)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return null;

            var stats = CalculateReadingStats(user);

            return new UserProfileDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Bio = user.Bio,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt,
                ReadingStats = stats
            };
        }

        public async Task<UserProfileDto?> UpdateProfile(int userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            if (updateProfileDto.Name != null) user.Name = updateProfileDto.Name;
            if (updateProfileDto.Bio != null) user.Bio = updateProfileDto.Bio;
            if (updateProfileDto.AvatarUrl != null) user.AvatarUrl = updateProfileDto.AvatarUrl;

            await _context.SaveChangesAsync();
            return await GetUserProfile(userId);
        }

        public async Task<List<UserBookDto>> GetUserBooks(int userId, string? status = null)
        {
            var query = _context.UserBooks
                .Include(ub => ub.Book)
                .Where(ub => ub.UserId == userId);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(ub => ub.Status == status);
            }

            return await query.Select(ub => new UserBookDto
            {
                BookId = ub.BookId,
                Title = ub.Book.Title,
                Author = ub.Book.Author,
                Status = ub.Status,
                Format = ub.Format,
                AddedAt = ub.AddedAt,
                CoverUrl = ub.Book.CoverUrl
            }).ToListAsync();
        }

        public async Task<UserBookDto?> AddUserBook(int userId, AddUserBookDto addUserBookDto)
        {
            var existingUserBook = await _context.UserBooks
                .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == addUserBookDto.BookId);

            if (existingUserBook != null)
            {
                existingUserBook.Status = addUserBookDto.Status;
                existingUserBook.Format = addUserBookDto.Format;
            }
            else
            {
                existingUserBook = new UserBook
                {
                    UserId = userId,
                    BookId = addUserBookDto.BookId,
                    Status = addUserBookDto.Status,
                    Format = addUserBookDto.Format,
                    AddedAt = DateTime.UtcNow
                };
                _context.UserBooks.Add(existingUserBook);
            }

            await _context.SaveChangesAsync();

            var book = await _context.Books.FindAsync(addUserBookDto.BookId);
            if (book == null) return null;

            return new UserBookDto
            {
                BookId = book.BookId,
                Title = book.Title,
                Author = book.Author,
                Status = existingUserBook.Status,
                Format = existingUserBook.Format,
                AddedAt = existingUserBook.AddedAt,
                CoverUrl = book.CoverUrl
            };
        }

        public async Task<UserBookDto?> UpdateUserBook(int userId, int bookId, UpdateUserBookDto updateUserBookDto)
        {
            var userBook = await _context.UserBooks
                .Include(ub => ub.Book)
                .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId);

            if (userBook == null) return null;

            userBook.Status = updateUserBookDto.Status;
            userBook.Format = updateUserBookDto.Format;

            await _context.SaveChangesAsync();

            return new UserBookDto
            {
                BookId = userBook.BookId,
                Title = userBook.Book.Title,
                Author = userBook.Book.Author,
                Status = userBook.Status,
                Format = userBook.Format,
                AddedAt = userBook.AddedAt,
                CoverUrl = userBook.Book.CoverUrl
            };
        }

        public async Task<bool> RemoveUserBook(int userId, int bookId)
        {
            var userBook = await _context.UserBooks
                .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId);

            if (userBook == null) return false;

            _context.UserBooks.Remove(userBook);
            await _context.SaveChangesAsync();
            return true;
        }

        private ReadingStatsDto CalculateReadingStats(User user)
        {
            return new ReadingStatsDto
            {
                TotalBooksRead = user.UserBooks.Count(ub => ub.Status == "Completed"),
                CurrentlyReading = user.UserBooks.Count(ub => ub.Status == "Currently Reading"),
                WantToRead = user.UserBooks.Count(ub => ub.Status == "Want to Read"),
                FormatBreakdown = user.UserBooks
                    .GroupBy(ub => ub.Format)
                    .ToDictionary(g => g.Key, g => g.Count()),
                AverageRating = user.Reviews.Any() ? user.Reviews.Average(r => r.Rating) : 0,
                TotalReviews = user.Reviews.Count
            };
        }
    }
}