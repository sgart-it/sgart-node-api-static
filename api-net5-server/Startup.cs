using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Sgart.Api.Server.Models;
using Sgart.Api.Server.Services;

namespace Sgart.Api.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            /*******************************************************
             * DI: appsettings.json
             */
            var settings = Configuration.GetSection("Settings").Get<AppSettings>();
            services.AddSingleton<AppSettings>(settings);

            /*******************************************************
             * CORS configuration
             */
            // default cors policy: abilito a ricevere chiamate da uno o più domini diversi
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder
                        //.WithOrigins("http://static.sgart.it:8080") // deve coincidere con la url del dominio chiamante senza slash finale
                        .WithOrigins(settings.CORS.Origins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        //.WithHeaders(HeaderNames.ContentType, HeaderNames.Accept)
                        //.AllowAnyOrigin() // non supportato da tutti ibrowser perche insicuro
                        ;
                });
            });

            /*******************************************************
             * aggiungo l'autenticazione con JWT Bearer
             */
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                    {
                        //options.RequireHttpsMetadata = true;  // riattivare in prod

                        options.TokenValidationParameters = AuthService.GetTokenValidationParameters(settings);
                    });


            /*******************************************************
             * DI:  aggiungo i servizi
             */
            services.AddScoped<AuthService>();

            /*******************************************************
             * aggiungo la gestione dei controllers
             */
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();    // TODO: riattivare sempre in produzione

            app.UseRouting();

            app.UseCors();  // uso CORS

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
