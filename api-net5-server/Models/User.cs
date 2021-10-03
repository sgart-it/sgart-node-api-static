using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sgart.Api.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }
}
