using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BookReviewsAPI.DTOs;
using BookReviewsAPI.Services;

namespace BookReviewsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewsController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("book/{bookId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetBookReviews(int bookId)
        {
            var reviews = await _reviewService.GetBookReviews(bookId);
            return Ok(reviews);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetUserReviews(int userId)
        {
            var reviews = await _reviewService.GetUserReviews(userId);
            return Ok(reviews);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto createReviewDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var review = await _reviewService.CreateReview(userId, createReviewDto);
            
            if (review == null)
            {
                return BadRequest("You have already reviewed this book");
            }

            return CreatedAtAction(nameof(GetBookReviews), new { bookId = review.BookId }, review);
        }

        [Authorize]
        [HttpPut("{reviewId}")]
        public async Task<ActionResult<ReviewDto>> UpdateReview(int reviewId, UpdateReviewDto updateReviewDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var review = await _reviewService.UpdateReview(reviewId, userId, updateReviewDto);
            
            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<ActionResult> DeleteReview(int reviewId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _reviewService.DeleteReview(reviewId, userId);
            
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}