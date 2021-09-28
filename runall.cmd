@echo off
REM start .\api-server\node_modules\.bin\nodemon .\api-server\server.js

start .\api-express-server\node_modules\.bin\nodemon .\api-express-server\bin\www

cd .\client-server
start .\node_modules\.bin\http-server -o index.html