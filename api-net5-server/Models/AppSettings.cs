using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sgart.Api.Server.Models
{
    public class AppSettings
    {
        public CORSSettings CORS { get; set; }
        public JwtSettings Jwt { get; set; }
    }

    public class JwtSettings
    {
        /// <summary>
        /// chiave segreta di codifica token JWT
        /// </summary>
        public string SecretKey { get; set; }

        /// <summary>
        /// dentificativo dell’entità che ha generato il token
        /// </summary>
        public string Issuer { get; set; }

        public string Audience { get; set; }

        /// <summary>
        /// scadenza del token in minuti rispetto a quando è stato generato
        /// </summary>
        public int ExpireMinutes { get; set; }

    }

    /// <summary>
    /// Cross-Origin Resource Sharing(CORS) - HTTP
    /// </summary>
    public class CORSSettings
    {
        public string[] Origins { get; set; }
    }
}
