@echo off

REM server di esempio node js puro
REM start .\api-server\node_modules\.bin\nodemon .\api-server\server.js

REM server di esempio node con express
start .\api-express-server\node_modules\.bin\nodemon .\api-express-server\bin\www

REM client statico solo html e javascript
cd .\client-server
start .\node_modules\.bin\http-server -o index.html