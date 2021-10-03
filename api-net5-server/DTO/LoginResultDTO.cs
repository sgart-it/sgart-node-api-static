using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sgart.Api.Server.DTO
{
    public class LoginResultDTO
    {
        public string Token { get; set; }
        public bool Valid { get; set; }
    }
}
