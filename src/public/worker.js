
const showLocalNotification = (title, worker) => {
    worker.showNotification(title);
}

async function saveSubscription(subscription) {

    const res = await fetch("/save-subscription", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription),
    })
    const resText = await res.text();
    console.log("RESPUESTA AL GUARDAR SUBSCRIPTION: ", resText)
}

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}


self.addEventListener('activate', async () => {
    console.log("Worker SPAM Activo")
    try {
        //key unica public de la aplicacion
        const applicationServerKey = "BFcQi0NBJeDqOp7q-1ZuAmz6RVNBI9-FeMOuHh0wmGe8roUhcksLsQDi2Iib13pZeQUJB3eN6z_6UHW6FrgMaxI"
        console.log("VAPID: ", applicationServerKey)

        //User visible This parameter restricts the developer to use push messages for notifications
        const options = { applicationServerKey, userVisibleOnly: true }

        //PUSH MANAGER ES EL PUSH SERVICE DEL BUSCADOR, SUBSCRIVIMOS 
        //EL WORKER A Ese servicio del BUSCADOR
        const subscription = await self.registration.pushManager.subscribe(options)
        console.log("Subscripcion:")
        console.log(JSON.stringify(subscription))
        saveSubscription(subscription)

    } catch (err) {
        console.log('Error')
        console.log(err);
    }
})


self.addEventListener('push', function (event) {
    console.log("PUSH RECIBIDO")
    showLocalNotification("TITULO:", self.registration)
    //recibe los PUSH desde el servidor
    if (event.data) {
        console.log('Push event!! ', event.data.text())
    } else {
        console.log('Push event but no data')
    }
})

