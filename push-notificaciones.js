'use strict';


// Preguntamos al usuario si el usuario quiere recibir notificaciones.
var permisoParaNotificar = Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});
// Mostrar Notificacion. 
function displayNotification() {
    if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function (reg) {
            console.log(reg);
            reg.showNotification('Hello world!', {
                body: 'Bizz! Bizz!',
                icon: './imagenes/gato.jpg',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'Notificacion PWA',
                data: {
                    dateOfArrival: Date.now(),
                },
                actions: [
                    {
                        action: 'explore', title: 'seven4n',
                        icon: './imagenes/s4n_logo.png'
                    },
                    {
                        action: 'close', title: 'Close notification',
                        icon: './imagenes/close.png'
                    },
                ]
            });
        });
    }else{
        permisoParaNotificar();
    }
}