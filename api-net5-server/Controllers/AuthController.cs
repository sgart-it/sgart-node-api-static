using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sgart.Api.Server.DTO;
using Sgart.Api.Server.Services;

namespace Sgart.Api.Server.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<DemoController> _logger;
        private readonly AuthService _authService;

        public AuthController(ILogger<DemoController> logger, AuthService authService)
        {
            _logger = logger;
            _authService = authService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<LoginResultDTO> Login([FromBody] LoginParamDTO p)
        {
            _logger.LogInformation($"Login user: {p.UserName}");

            var result = new LoginResultDTO();
            try
            {
                var token = await _authService.GetJwtTokenAsync(p.UserName, p.Password);

                return new LoginResultDTO { Token = token, Valid = token != null };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error");
                result.Token = null;
                result.Valid = false;
            }
            return result;
        }

        [HttpPost]
        [Route("validate")]
        public ActionResult<LoginResultDTO> Validate([FromBody] ValidateParamDTO p)
        {
            _logger.LogTrace("Validate token");

            bool valid = false;
            try
            {
                valid = _authService.ValidateJwtToken(p.Token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Validate error");
            }
            return new LoginResultDTO { Token = p.Token, Valid = valid };
        }
    }
}
