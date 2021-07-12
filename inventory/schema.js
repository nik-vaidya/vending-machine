const mongoose = require('mongoose')
const Schema = mongoose.Schema


// Defined mongo schema
const inventorySchema = new Schema({
    id: { type: String, default: "inventory", required: true },
    items: { type: Array, required: true }
})



// Create model with given schema to maintain inventory items
let createModel = async function () {
    let model = mongoose.model('inventory', inventorySchema)
    return model
}

module.exports.createModel = createModel