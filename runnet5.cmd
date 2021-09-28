@echo off

REM server di esempio .Net 5
start dotnet run --project  .\api-net5-server\Sgart.Api.Server.csproj

REM client statico solo html e javascript
cd .\client-server
start .\node_modules\.bin\http-server -o index.html

pause