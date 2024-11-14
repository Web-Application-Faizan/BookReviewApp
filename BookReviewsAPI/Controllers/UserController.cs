using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BookReviewsAPI.DTOs;
using BookReviewsAPI.Services;

namespace BookReviewsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile/{userId}")]
        public async Task<ActionResult<UserProfileDto>> GetUserProfile(int userId)
        {
            var profile = await _userService.GetUserProfile(userId);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile(UpdateProfileDto updateProfileDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _userService.UpdateProfile(userId, updateProfileDto);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpGet("{userId}/books")]
        public async Task<ActionResult<List<UserBookDto>>> GetUserBooks(int userId, [FromQuery] string? status)
        {
            var books = await _userService.GetUserBooks(userId, status);
            return Ok(books);
        }

        [Authorize]
        [HttpPost("books")]
        public async Task<ActionResult<UserBookDto>> AddUserBook(AddUserBookDto addUserBookDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userBook = await _userService.AddUserBook(userId, addUserBookDto);
            if (userBook == null) return NotFound("Book not found");
            return Ok(userBook);
        }

        [Authorize]
        [HttpPut("books/{bookId}")]
        public async Task<ActionResult<UserBookDto>> UpdateUserBook(int bookId, UpdateUserBookDto updateUserBookDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var userBook = await _userService.UpdateUserBook(userId, bookId, updateUserBookDto);
            if (userBook == null) return NotFound();
            return Ok(userBook);
        }

        [Authorize]
        [HttpDelete("books/{bookId}")]
        public async Task<ActionResult> RemoveUserBook(int bookId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _userService.RemoveUserBook(userId, bookId);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}