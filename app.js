const express = require('express')
const app = express()
const configuration = require('./conf.json')
const bodyParser = require('body-parser')
const machineController = require('./controller/machineController')
const inventory = require('./inventory/connection')



async function startMachine() {

    app.use(bodyParser.json())
    await inventory.setupConnection(configuration.mongoURL)
    app.use('/vendingmachine', machineController)
    app.listen(configuration.port, function (error) {
        if (!!error) {
            throw new Error(error)
        }
    })
}


startMachine()
    .then((res) => { console.log("Machine is ready to serve") })
    .catch((err) => { console.log("oops!! Fault occured in machine, please restart!! " + err) })