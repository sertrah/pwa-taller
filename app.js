(function() {
  'use strict';
  var initChiste = {
    key: '0',
    mensaje: 'cargando chiste....',
    icon_url: './imagenes/hellscream.gif'
  };
  var initUsuario = {
    cell: '3XXXXXXX',
    nombre: 'XXXXXX',
    apellido: 'XXXXXXX',
    titulo: 'XX',
    phone: '2XXXXXX',
    imagenGrande: './imagenes/hellscream.gif'
  };
  var app = {
    isLoading: true,
    chiste: {},
    usuario: {},
    spinner: document.querySelector('.loader__spinner'),
    container: document.querySelector('.vertical-container')
  };
  // ACCIONES DEL USUARIO
  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh contendio
    app.actualizarApp();
  });

  // FUNCIONES
  app.obtenerChiste = function() {
    var url = 'https://api.chucknorris.io/jokes/random';
    // TODO add cache logic here
    if ('caches' in window) {
      /*
             * MIRA si el servidor ya ha cacheado un chiste
             * Si el servidor ha cacheado la informacion la muestra
             * Mientras actualiza la data.
             */
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json;
            results['key'] = json.id;
            results['mensaje'] = json.mensaje;
            results['icon_url'] = json.icon_url;
            app.actualizarChisteDom(results);
          });
        }
      });
    }
    // Fetch the latest data.
    mostrarSpinner();

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
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
  app.obtenerUsuarioRamdom = function() {
    var url = 'https://randomuser.me/api/';
    // TODO add cache logic here
    if ('caches' in window) {
      /*
             * MIRA si el servidor ya ha cacheado un usuario
             * Si el servidor ha cacheado la informacion la muestra
             * Mientras actualiza los datos.
             */
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function updateFromCache(json) {
            var results = json;
            var results = {};
            results['cell'] = json.cell;
            results['nombre'] = json.nombre;
            results['apellido'] = json.apellido;
            results['titulo'] = json.titulo;
            results['phone'] = json.phone;
            results['imagenGrande'] = json.imagenGrande;
            app.actualizarUserDom(results);
          });
        }
      });
    }
    // Fetch the latest data.
    mostrarSpinner();

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = {};
          results['cell'] = response.results[0].cell;
          results['correo'] = response.results[0].email;
          results['nombre'] = response.results[0].name.first;
          results['apellido'] = response.results[0].name.last;
          results['titulo'] = response.results[0].name.title;
          results['phone'] = response.results[0].phone;
          results['imagenGrande'] = response.results[0].picture.large;
          app.actualizarUserDom(results);
        }
      } else {
        app.actualizarUserDom(initUsuario);

        // En caso bad, retorna el estado inicial.
      }
    };
    request.open('GET', url);
    request.send();
  };
  app.actualizarChisteDom = function(data) {
    document.querySelector('.mensaje').textContent = data.mensaje;
    if (app.isLoading) {
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };
  app.actualizarUserDom = function(data) {
    document.querySelector('#correo').textContent = data.correo;
    document.querySelector('#cel').textContent = data.cell;
    document.querySelector('#tel').textContent = data.phone;
    document.querySelector('.user-img-grande').src = data.imagenGrande;
    document.querySelector('#titulo').textContent = data.titulo;
    document.querySelector('.user').textContent = data.nombre;
    document.querySelector('#nombre').textContent =
      data.nombre + ' ' + data.apellido;
    if (app.isLoading) {
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };
  app.actualizarApp = function() {
    mostrarSpinner();
    app.obtenerChiste();
    app.obtenerUsuarioRamdom();
  };
  function mostrarSpinner() {
    app.isLoading = true;
  }
  // Guarda chistes en localStorage.
  app.guardarChiste = function() {
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
    app.obtenerUsuarioRamdom();
    console.log('OBTENGA COSAS OME');
  } else {
    /* Si el usuario usa la app por primera vez, o el uusuario no a guardado chistes
        * Entonces muestre chiste temporal. 
        */
    app.actualizarChisteDom(initChiste);
    app.actualizarUserDom(initUsuario);
    app.chiste = initChiste;
    app.usuario = initUsuario;
    app.guardarChiste();
    console.log('SETEO COSAS  COSAS OME');
  }
  // Preguntamos al usuario si el navegador soporta Services Workers
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker y Push notificaciones son soportados ');
    // Registramos el service Worker
    navigator.serviceWorker
      .register('/sw.js')
      .then(function(swReg) {
        console.log('Service Worker Registrado');
      })
      .catch(function(error) {
        console.error('[Service Worker Error]:', error);
      });
  } else {
    console.warn('Las notificaciones push no esta soportado');
  }
})();
