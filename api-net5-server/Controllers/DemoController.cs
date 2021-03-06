using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sgart.Api.Server.DTO;

namespace Sgart.Api.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DemoController : ControllerBase
    {
        private readonly ILogger<DemoController> _logger;

        public DemoController(ILogger<DemoController> logger)
        {
            _logger = logger;
        }


        [HttpGet]
        public string Get()
        {
            return $"OK Runnig API .NET 5, v. {Constants.VERSION}";
        }

        [HttpPost]
        public ResultDTO Post([FromBody] ParamDTO p)
        {
            _logger.LogTrace("Post");
            
            return new ResultDTO
            {
                Date = DateTime.Now,
                Value = p.Value,
                Server = ".Net 5"
            };
        }
    }
}
