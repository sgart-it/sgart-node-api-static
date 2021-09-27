@echo off
start .\api-server\node_modules\.bin\nodemon .\api-server\server.js

cd .\client-server
start .\node_modules\.bin\http-server -o index.html