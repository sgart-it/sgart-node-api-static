# sgart-node-api-static

Demo applicazione statica in html/js che usa delle api su un diverso dominio tramite CORS

https://www.sgart.it

Aggiunto demo Token JWT


## installazione

richiede node.js (testato con v14.17.6) e .Net 5

nelle cartelle .\client-server, .\api-server e .\api-express-server eseguire

npm install

nella cartella .\api-net5-server

dotnet restore


### host

modificare il file C:\Windows\System32\drivers\etc\host e aggiungere

127.0.0.1	static.sgart.it

127.0.0.1	api.sgart.it


### esecuzione demo

runall.cmd (client javascript + node js)
runexpress.cmd (client javascript + node js express)
runnet5.cmd (client javascript + .Net 5 C#)

richiamare il client con http://static.sgart.it:8080
(le API server rispondono alla url http://api.sgart.it:3000)


## note 

il web server (client-server) con il codice html (statico) non deve girare su localhost altrimenti il browser blocca le chiamate CORS.


## errori

se nella developer console compare l'errore

Access to fetch at 'http://api.sgart.it:3000/' from origin 'http://static.sgart.it:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'http://static.sgart.local:8080' that is not equal to the supplied origin. Have the server send the header with a valid value, or, if an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

index.html:19 POST http://api.sgart.it:3000/ net::ERR_FAILED

index.html:34 TypeError: Failed to fetch


vuol dire che il parametro 'Access-Control-Allow-Origin': 'http://www.sgart.local:8080' nel server.js non è corretto deve coincidere con il chiamante 'Access-Control-Allow-Origin': 'http://www.sgart.it:8080'