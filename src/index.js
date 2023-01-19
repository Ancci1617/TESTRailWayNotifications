const { urlencoded } = require("express");
const express = require("express");
const app = express();
const path = require("path")
const webpush = require('web-push')
const cors = require("cors")
const morgan = require("morgan")


//Others
const dummyDb = { subscription: [] }
const vapidKeys = {
    publicKey:
        "BFcQi0NBJeDqOp7q-1ZuAmz6RVNBI9-FeMOuHh0wmGe8roUhcksLsQDi2Iib13pZeQUJB3eN6z_6UHW6FrgMaxI",
    privateKey: "UDgp4feSRm56geeyGPCBp5Wu2LQiLQTnVx9FdngMuPU"
}

const saveToDatabase = async subscription => {
    //Guarda en la DB
    dummyDb.subscription.push(subscription)
}
const sendNotification = (subscription, dataToSend = 'DEFAULT DATA') => {
    webpush.sendNotification(subscription, dataToSend)
}


//Settings
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
//Settings VapidKEYS of the application
webpush.setVapidDetails(

    'mailto:rodrigovazquez1617@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey

)


//Middlewares
app.use(express.json())
app.use(cors()) // nosequehace
app.use(urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan("dev"))



//Router
app.get("/", (req, res) => {
    res.render("index")
})




app.get('/send-notifications', (req, res) => {

    const subscriptions = dummyDb.subscription
    for (subscription of subscriptions) {

        console.log("SUBSCRIPCION: ");
        console.log(subscription);
        const message = 'Mensaje en notificacion'
        sendNotification(subscription, message)

    }
    res.send("Mensaje enviado correctamente")
})

//SubscriptionRouter
app.get('/reset-subscription', (req, res) => {
    dummyDb.subscription = "";
    res.json({ subscription: dummyDb.subscription });
})

app.get('/get-subscription', (req, res) => {
    res.json({ subscription: dummyDb.subscription });
})

app.post('/save-subscription', async (req, res) => {

    const subscription = req.body
    console.log(req.body)
    await saveToDatabase(subscription)
    res.json({ message: 'success' })
})

//Server
app.listen(process.env.PORT||3000 , () => {
    console.log("Running on port", process.env.PORT||3000)
})









