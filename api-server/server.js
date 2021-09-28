const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || '3000';

http.createServer(function (request, response) {
    console.log('request starting ' + request.url + '...');	//visualizzo nella console
 
    const headers = {
        'Access-Control-Allow-Origin': 'http://static.sgart.it:8080', // deve coincidere con la url del dominio chiamante senza slash finale
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
        'Access-Control-Max-Age': 86400, // 1 days * 24 ore * 60 minuti * 60 secondi
        'Vary': 'Origin, Access-Control-Request-Headers, Access-Control-Request-Method'
        /* altri header se necessario */
    };

    console.log('---------------------------------');
    console.log(`Request [${request.method}] ${new Date()}`, request.headers);

    if (request.method === 'OPTIONS') {
        console.log('preflight request');

        response.writeHead(204, headers);
        response.end();
        return;
    }

    if (['GET', 'POST'].indexOf(request.method) > -1) {
        const content = { date: new Date() };
        console.log('content', content);

        response.writeHead(200, headers);
        response.end(JSON.stringify(content), 'utf-8');
        return;
    }

    response.writeHead(405, headers);
    response.end(`${request.method} is not allowed for the request.`);

}).listen(port); //imposto il server per ascoltare sulla porta indicata
console.log('Server running at http://127.0.0.1:' + port + '/');
