var messageDiv = document.querySelector(".mensaje-resultado")

//Revisar que el navegador tenga habilitada las librerias pertitenetes
const check = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
        throw new Error('No Push API Support!')
    }
}

const registerServiceWorker = async () => {
    const worker = await navigator.serviceWorker.register("worker.js");
    return worker;
}

const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {


        messageDiv.innerHTML += "Permiso de notificacion no aprobado <br>"
        
        throw new Error('Permission not granted for Notification');
    
    }
}





const main = async () => {
    check()
    const worker = await registerServiceWorker()
    requestNotificationPermission()
    // showLocalNotification("Local notification", worker)

}
main()



