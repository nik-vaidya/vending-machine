const mongoose = require('mongoose')

// setup connection with mongo to store items
let setupConnection = async function (url) {

    let options = {
        dbName: "vendingmachine",
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    try {
        await mongoose.connect(url, options)
        console.log("Connected with database successfully !!")
    } catch (error) {
        throw error
    }
}

module.exports = { setupConnection }