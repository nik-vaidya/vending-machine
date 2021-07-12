const inventoryModel = require('./schema')
const _ = require('lodash')

/**
 * Check whether document is available in db
 * This is to ensure whether we are inserting items first time or not
 */
const getDocInDB = async function () {
    try {
        let storeModel = await inventoryModel.createModel()
        return await storeModel.findOne({ id: "inventory" }).lean()
    } catch (error) {
        console.error("Error while checking Doc in DB :: " + error.message)
        throw error
    }
}

/**
 * It will dispense the item from stock
 * @param {*} itemName
 */
const getItem = async function (itemName) {
    try {
        let inventory = await getDocInDB()
        let stock = inventory['items']
        var item = {}
        for (var i in stock) {
            if (stock[i].name == itemName) {
                item = stock[i]
                break;
            }
        }
        return item
    } catch (error) {
        console.error("Error while getting item :: " + error.message)
        throw error
    }
}

/**
 * Reduce the stock of given item by 1 after dispensing the item
 * @param {*} itemName 
 */
const modifyItemQuantity = async function (itemName) {
    try {
        let inventory = await getDocInDB()
        let stock = inventory['items']
        for (var i in stock) {
            if (stock[i].name == itemName) {
                stock[i].quantity -= 1
                break;
            }
        }
        let doc = {
            "id": "inventory",
            "items": stock
        }
        return await upsertDataInDb(doc)
    } catch (error) {
        console.error("Error while checking Doc in DB :: " + error.message)
        throw error
    }
}

/**
 * Find and update the DB doc
 * @param {*} data 
 */
const upsertDataInDb = async function (data) {
    let storeModel = await inventoryModel.createModel()
    return await storeModel.findOneAndUpdate({ id: "inventory" },
        data,
        { upsert: true, runValidators: true, returnNewDocument: true, new: true },
        function (err, result) {
            if (err) {
                throw new Error(err);
            }
            else {
                return result;
            }
        }
    )

}


module.exports = {
    modifyItemQuantity,
    upsertDataInDb,
    getItem,
    getDocInDB
}