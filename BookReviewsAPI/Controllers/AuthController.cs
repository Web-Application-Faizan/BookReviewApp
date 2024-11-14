using Microsoft.AspNetCore.Mvc;
using BookReviewsAPI.DTOs;
using BookReviewsAPI.Services;

namespace BookReviewsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = await _authService.Register(registerDto);
            if (user == null)
            {
                return BadRequest("Email already exists");
            }

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _authService.Login(loginDto);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            return Ok(user);
        }

        [HttpPost("google")]
        public async Task<ActionResult<UserDto>> GoogleAuth([FromBody] ExternalAuthDto externalAuth)
        {
            if (string.IsNullOrEmpty(externalAuth.IdToken))
            {
                return BadRequest("Invalid token");
            }

            var user = await _authService.AuthenticateGoogleUser(externalAuth.IdToken);
            if (user == null)
            {
                return BadRequest("Invalid Google token");
            }

            return Ok(user);
        }
    }
}