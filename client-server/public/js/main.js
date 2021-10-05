// ATTENZIONE => Internet Explorer non supporta questo:
// const e let non sono supportate
// => (arrow function) non supportata
// ` (alt+96) come delimitatore stringhe non supportato
// per una versione funzionante su IE usa main-ie.js contiene una versione parziale di fetch

const BASE_API = 'http://api.sgart.it:3000';

/**
 * gestione storage token JWT 
 */
const jwtToken = (function () {
    const _tokenKey = 'token';
    const _tokenStorage = sessionStorage; // per renderlo permanente usare localStorage
    //N.B.
    // sessionStorage: viene canellato alla chiusura del browser ma mantenuto al reload della pagina
    // localStorage: rimane anche dopo la chiusura finchè non viene esplicitamente rimosso

    function setToken(token) {
        if (token === undefined || token === null || token === "") {
            _tokenStorage.removeItem(_tokenKey);
            return;
        }
        _tokenStorage.setItem(_tokenKey, token);
    }

    function getToken() {
        return _tokenStorage.getItem(_tokenKey);
    }

    function clearToken() {
        return setToken(null);
    }

    return {
        set: setToken,
        get: getToken,
        clear: clearToken
    }
})();

//--------------------------------------------------------------------------------------------------
// chiamata CORS anonima con fetch
function handleLoadAnonymousFetch() {
    console.log('handleLoadAnonymousFetch');

    const elemResult = document.getElementById("result");
    elemResult.innerHTML = "Attendi ...";

    //fetch("http://cors.localhost:3000/", {  // non funziona per le restrizioni del browser
    fetch(BASE_API + "/demo", {
        method: "POST",
        mode: "cors", // parametro vincolante per le chiamate cross domain
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: 1 }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            elemResult.innerHTML = JSON.stringify(data);
        })
        .catch((error) => {
            console.error(error);
            elemResult.innerHTML = error;
        });
}

// chiamata CORS anonima con XMLHttpRequest x IE e tutti i Browser
function handleLoadAnonymousXMLHttpRequest() {
    console.log('handleLoadAnonymousXMLHttpRequest');

    const elemResult = document.getElementById("result-2");
    elemResult.innerHTML = "Attendi ...";

    var url = BASE_API + "/demo";

    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var data = JSON.parse(this.responseText);
                console.log(data);
                elemResult.innerHTML = JSON.stringify(data);
            } else {
                var error = this.status + ' ' + this.responseText;
                console.error(error);
                elemResult.innerHTML = error;
            }
        }
    };
    xHttp.open("POST", url, true);
    xHttp.setRequestHeader("Content-type", "application/json");
    var data = JSON.stringify({ value: 1 });
    xHttp.send(data);
}

// gestione login e get token JWT con fetch
function handleLogin(e) {
    e.preventDefault();

    console.log('handleLogin');

    const elemResult = document.getElementById("result-login");
    elemResult.innerHTML = "Attendi ...";

    // cancello il valore moemorizzato
    jwtToken.set(null);

    const user = document.getElementById("username").value;
    const pwd = document.getElementById("password").value;

    fetch(BASE_API + "/auth/login", {
        method: "POST",
        mode: "cors", // parametro vincolante per le chiamate cross domain
        headers: { "Content-Type": "application/json" },
        // passo lo user name e la password ... tutto SEMPRE in HTTPS in PRODUZIONE
        body: JSON.stringify({ username: user, password: pwd }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(`Token valid: ${data.valid}`);
            elemResult.innerHTML = JSON.stringify(data);
            if (data.valid === true) {

                jwtToken.set(data.token);
            }
        })
        .catch((error) => {
            console.error(error);
            elemResult.innerHTML = error;
        });
}

// gestione chiamata autenticata con Bearer JWT con fetch
function handleLoadAuth() {
    console.log('handleLoadAuth');

    const elemResult = document.getElementById("result-auth");
    elemResult.innerHTML = "Attendi ...";

    // recupero il token alvato
    const token = jwtToken.get();
    if (token === undefined || token === null || token === "") {
        elemResult.innerHTML = "Error il token è vuoto";
        return;
    }

    fetch(BASE_API + "/secure/protected-data", {
        method: "GET",
        mode: "cors", // parametro vincolante per le chiamate cross domain
        headers: {
            "Content-Type": "application/json",
            // passo nell'header il Bearer token JWT
            "Authorization": "Bearer " + token,
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return {
                    status: response.status,
                    message: response.statusText
                }
            }
        })
        .then((data) => {
            console.log(data);
            elemResult.innerHTML = JSON.stringify(data);
        })
        .catch((error) => {
            console.error(error);
            elemResult.innerHTML = error;
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (isLocalhost === true) {
        console.log('%cAttenzione in localhost le chiamate CORS non funzionano', 'background-color: #f00; padding: 20px; color: #fff; font-family:bold; font-size: 2em');
    } else {
        document.getElementById("warning").style.display = 'none';
    }

    document.getElementById("btn-reload").addEventListener("click", handleLoadAnonymousFetch);
    document.getElementById("btn-reload-2").addEventListener("click", handleLoadAnonymousXMLHttpRequest);
    document.getElementById("form-login").addEventListener("submit", handleLogin);
    document.getElementById("btn-reload-auth").addEventListener("click", handleLoadAuth);
    document.getElementById("btn-clear-token").addEventListener("click", function () { jwtToken.clear(); });


    handleLoadAnonymousFetch();
    handleLoadAnonymousXMLHttpRequest();
});