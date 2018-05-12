(function () {
    'use strict';
    var initChiste = {
        key: '',
        mensaje: '',
        icon: '',
    };
    var app = {
        isLoading: true,
        chiste: {},
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        container: document.querySelector('.main'),
        addDialog: document.querySelector('.dialog-container'),
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };
    // ACCIONES DEL USUARIO
    document.getElementById('butRefresh').addEventListener('click', function () {
        // Refresh contendio
        app.actualizarChiste();
    });

    // FUNCIONES
    app.obtenerChiste = function () {
        var url = 'https://api.chucknorris.io/jokes/random';
        // TODO add cache logic here
        if ('caches' in window) {
            /*
             * MIRA si el servidor ya ha cacheado un chiste
             * Si el servidor ha cacheado la informacion la muestra
             * Mientras actualiza la data.
             */
            caches.match(url).then(function (response) {
                if (response) {
                    response.json().then(function updateFromCache(json) {
                        var results = json.query.results;
                        results['key'] = json.id;
                        results['mensaje'] = json.value;
                        results['icon'] = json.icon_url;
                        app.actualizarChiste(results);
                    });
                }
            });
        }
        // Fetch the latest data.
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    var results = response;
                    results['key'] = response.id;
                    results['mensaje'] = response.value;
                    results['icon'] = response.icon_url;
                    app.actualizarChiste(results);
                }
            } else {
                // En caso bad, retorna el estado inicial.
                app.actualizarChiste(initChiste);
            }
        };
        request.open('GET', url);
        request.send();
    };

    app.actualizarChiste = function (data) {
        document.querySelector('.id').textContent = data.id;
        document.querySelector('.mensaje').textContent = data.value;
        document.querySelector('.imagen').textContent = data.icon_url;
        console.log(data);
    }

    // Guarda chistes en localStorage.
    app.guardarChiste = function () {
        var chiste = JSON.stringify(app.chiste);
        localStorage.chiste = chiste;
    };

    /*****************************************************************************
     *
     * Y ASI INICIA TODO
     *
     ****************************************************************************/
    app.chiste = localStorage.chiste;
    if (app.chiste) {
        app.obtenerChiste();
        console.log('OBTENGA COSAS OME');
    } else {
        /* Si el usuario usa la app por primera vez, o el uusuario no a guardado chistes
        * Entonces muestre chiste temporal. 
        */
       app.actualizarChiste(initChiste);
       app.chiste = initChiste;
       app.guardarChiste();
       console.log('SETEO COSAS  COSAS OME');
    }
    // Preguntamos al usuario si el navegador soporta Services Workers
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker y Push notificaciones son soportados ');
        // Registramos el service Worker
        navigator.serviceWorker.register('/sw.js')
            .then(function (swReg) {
                console.log('Service Worker Registrado');
            }).catch(function (error) {
                console.error('[Service Worker Error]:', error);
            });
    } else {
        console.warn('Las notificaciones push no esta soportado');
    }

})();