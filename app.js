(function () {
    'use strict';
    var initChiste = {
        key: '0',
        mensaje: 'cargando chiste.',
        icon_url: './imagenes/hellscream.gif',
    };
    var app = {
        isLoading: true,
        chiste: {},
        spinner: document.querySelector('.loader__spinner'),
        container: document.querySelector('.vertical-container'),

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
                        var results = json;
                        results['key'] = json.id;
                        results['mensaje'] = json.value;
                        results['icon_url'] = json.icon_url;
                        app.actualizarChisteDom(results);
                    });
                }
            });
        }
        // Fetch the latest data.
        mostrarSpinner();

        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    var results = response;
                    results['key'] = response.id;
                    results['mensaje'] = response.value;
                    results['icon_url'] = response.icon_url;
                    app.actualizarChisteDom(results);
                    app.chiste = results;
                    app.guardarChiste();

                }
            } else {
                // En caso bad, retorna el estado inicial.
                app.actualizarChisteDom(initChiste);
            }
        };
        request.open('GET', url);
        request.send();
    };

    app.actualizarChisteDom = function (data) {
        document.querySelector('.id').textContent = data.id;
        document.querySelector('.mensaje').textContent = data.value;
        document.querySelector('.imagen').src = data.icon_url;
        if (app.isLoading) {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    }
    app.actualizarChiste = function () {
        mostrarSpinner();
        app.obtenerChiste();
    }
    function mostrarSpinner() {
        app.isLoading = true;
        app.spinner.removeAttribute('hidden');

    }
    // Guarda chistes en localStorage.
    app.guardarChiste = function () {
        localStorage.removeItem('chiste');
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
        app.actualizarChisteDom(initChiste);
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