using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Sgart.Api.Server.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sgart.Api.Server.Services
{
    /// <summary>
    /// Autenticazione con JWT
    /// </summary>
    public class AuthService
    {
        private readonly ILogger<AuthService> _logger;
        private readonly AppSettings _settings;

        public AuthService(ILogger<AuthService> logger, AppSettings settings)
        {
            _logger = logger;
            _settings = settings;
        }

        public async Task<string> GetJwtTokenAsync(string userName, string password)
        {
            _logger.LogTrace("Get Token");

            if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(password))
                return null;

            var user = await ValidateCredential(userName, password);

            if (user == null)
                return null;

            return GenerateJwtToken(user);
        }

        private async Task<User> ValidateCredential(string userName, string password)
        {
            _logger.LogTrace("Validate");

            // simulo uno storage delle credenziali
            var users = new[]
            {
                new {Id=1, UserName= "user1", FullName="Utente 1", Password = "pwd1", Roles = new []{ "user","admin" } },
                new {Id=2,UserName= "user2", FullName="Utente 2",Password = "pwd2", Roles = new []{ "user" }  },
                new {Id=3,UserName= "user3", FullName="Utente 3",Password = "pwd3", Roles = new []{ "admin" }  }
            };

            // simulo un ritardo di accesso allo storage
            await Task.Delay(1000);

            // nella realtà la verifica delle credenziali verrà fatta su uno storage/database
            var u = users.FirstOrDefault(x => x.UserName == userName && x.Password == password);
            if (u == null)
                return null;

            return new User
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
                Roles = u.Roles.ToList()
            };
        }

        /// <summary>
        /// ritorna una stringa composta di tre parti separate da un punto
        /// header.payload.signature
        /// HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secretKey)
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        private string GenerateJwtToken(User user)
        {
            _logger.LogTrace("Generate");

            // genero la i claims relativi alle proprietà utente
            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                    new Claim(JwtRegisteredClaimNames.Name, user.FullName ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString())    //Guid.NewGuid().ToString()) 
                };
            foreach (var r in user.Roles)
            {
                claims.Add(new Claim("role", r));
            }

            // genero il token JWT
            var securityKey = new SymmetricSecurityKey(System.Text.Encoding.ASCII.GetBytes(_settings.Jwt.SecretKey));

            // meglio HmacSha256Signature rispetto a HmacSha256 che è deprecato
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var dt = DateTime.UtcNow;   // le date devono essere in UTC

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),// sub
                Issuer = _settings.Jwt.Issuer,  // iss
                Audience = _settings.Jwt.Audience,  // aud
                IssuedAt = dt,  // iat
                Expires = dt.AddMinutes(_settings.Jwt.ExpireMinutes < 5 ? 5 : _settings.Jwt.ExpireMinutes), // exp, impongo una durata mnima di 5 minuti
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// valida il token per verificare se la signature, issuer, audience, lifetime sono validi
        /// </summary>
        /// <param name="token"></param>
        /// <returns>true/false</returns>
        public bool ValidateJwtToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return false;

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();

                tokenHandler.ValidateToken(token, GetTokenValidationParameters(_settings), out SecurityToken validatedToken);

                return true;
            }
            catch (SecurityTokenInvalidIssuerException ex)
            {
                _logger.LogWarning($"Invalid issuer: {ex.InvalidIssuer}");
            }
            catch (SecurityTokenInvalidAudienceException ex)
            {
                _logger.LogWarning($"Invalid audience: {ex.InvalidAudience}");
            }
            catch (SecurityTokenExpiredException ex)
            {
                _logger.LogWarning($"Invalid lifetime, expires: {ex.Expires}");
            }
            catch (Exception ex)
            {

                _logger.LogWarning(ex, "Validate error");
            }
            return false;

        }

        public static TokenValidationParameters GetTokenValidationParameters(AppSettings settings)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.ASCII.GetBytes(settings.Jwt.SecretKey));

            return new TokenValidationParameters
            {
                ValidIssuer = settings.Jwt.Issuer,
                ValidateIssuer = true,
                ValidAudience = settings.Jwt.Audience,
                ValidateAudience = string.IsNullOrWhiteSpace(settings.Jwt.Audience) == false,
                IssuerSigningKey = key,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero    // senza questo il lifetime minimo è 5 minuti
            };
        }
    }
}
