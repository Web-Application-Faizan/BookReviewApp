using Microsoft.EntityFrameworkCore;
using BookReviewsAPI.Data;
using BookReviewsAPI.DTOs;
using BookReviewsAPI.Models;

namespace BookReviewsAPI.Services
{
    public class BookService
    {
        private readonly AppDbContext _context;

        public BookService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<BookDto>> GetAllBooks()
        {
            return await _context.Books
                .Select(b => new BookDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author,
                    ISBN = b.ISBN,
                    Description = b.Description,
                    CoverUrl = b.CoverUrl,
                    PublishedDate = b.PublishedDate,
                    AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0,
                    ReviewCount = b.Reviews.Count
                })
                .ToListAsync();
        }

        public async Task<BookDto?> GetBookById(int id)
        {
            var book = await _context.Books
                .Include(b => b.Reviews)
                .FirstOrDefaultAsync(b => b.BookId == id);

            if (book == null) return null;

            return new BookDto
            {
                BookId = book.BookId,
                Title = book.Title,
                Author = book.Author,
                ISBN = book.ISBN,
                Description = book.Description,
                CoverUrl = book.CoverUrl,
                PublishedDate = book.PublishedDate,
                AverageRating = book.Reviews.Any() ? book.Reviews.Average(r => r.Rating) : 0,
                ReviewCount = book.Reviews.Count
            };
        }

        public async Task<BookDto> CreateBook(CreateBookDto createBookDto)
        {
            var book = new Book
            {
                Title = createBookDto.Title,
                Author = createBookDto.Author,
                ISBN = createBookDto.ISBN,
                Description = createBookDto.Description,
                CoverUrl = createBookDto.CoverUrl,
                PublishedDate = createBookDto.PublishedDate
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return new BookDto
            {
                BookId = book.BookId,
                Title = book.Title,
                Author = book.Author,
                ISBN = book.ISBN,
                Description = book.Description,
                CoverUrl = book.CoverUrl,
                PublishedDate = book.PublishedDate,
                AverageRating = 0,
                ReviewCount = 0
            };
        }

        public async Task<BookDto?> UpdateBook(int id, UpdateBookDto updateBookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return null;

            if (updateBookDto.Title != null) book.Title = updateBookDto.Title;
            if (updateBookDto.Author != null) book.Author = updateBookDto.Author;
            book.ISBN = updateBookDto.ISBN;
            book.Description = updateBookDto.Description;
            book.CoverUrl = updateBookDto.CoverUrl;
            if (updateBookDto.PublishedDate.HasValue) book.PublishedDate = updateBookDto.PublishedDate.Value;

            await _context.SaveChangesAsync();

            return await GetBookById(id);
        }

        public async Task<bool> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}