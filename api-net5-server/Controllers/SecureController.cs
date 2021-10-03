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
    /// <summary>
    /// controller con metodi che richiedono autenticazione tramite JWT Token
    /// da passare nell'header 
    /// Authorization: Bearer [jwtToken]
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SecureController : ControllerBase
    {
        private readonly ILogger<DemoController> _logger;

        public SecureController(ILogger<DemoController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("protected-data")]
        public async Task<object> ProtectedData()
        {
            _logger.LogTrace("ProtectedData");

            try
            {
                return new { 
                    Text = "frase segreta da mostrare solo a chi è autenticato", 
                    Date = DateTime.UtcNow 
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ProtectedData error");
            }
            return null;
        }

    }
}
