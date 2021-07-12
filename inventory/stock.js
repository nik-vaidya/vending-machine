const operation = require('../inventory/operation')
const _ = require('lodash')

//Increase quantity of already existing item
function fillOldStock(stock, refillItem) {
    for (var i in stock) {
        if (stock[i].name == refillItem.name) {
            stock[i].quantity += refillItem.quantity
            break;
        }
    }
    return stock

}


/**
 * Fill up the inventory with input items
 * Input can be one item or array of items
 * If item is already exists then increase the quantity otherwise
 * add new item to stock
 * @param {*} req 
 * @param {*} res 
 */
const fillUpStock = async function (req, res) {
    try {
        console.log("Adding Item to inventory..")
        var data = req.body
        var response = {
            "status": "success",
            "statusCode": 200
        }
        data = _.isArray(data) ? data : [data]
        let doc = {
            "id": "inventory",
            "items": data
        }
        let inventory = await operation.getDocInDB()


        if (!_.isEmpty(inventory)) {
            let items = inventory["items"]
            _.forEach(data, function (item) {
                let oldItem = _.find(items, function (each) {
                    return each.name === item.name;
                });
                if (_.isEmpty(oldItem)) {
                    items = _.concat(items, item);
                }
                else {
                    items = fillOldStock(items, item)
                }
            });
            _.set(doc, "items", items)
            let result = await operation.upsertDataInDb(doc)
            _.set(response, "result", result)
        }
        else {
            let result = await operation.upsertDataInDb(doc)
            _.set(response, "result", result)
        }
        res.send(response)
    } catch (error) {
        console.log("Error while adding item to inventory" + error.message)
        _.set(response, "status", "failure")
        _.set(response, "statusCode", 500)
        _.set(response, "message", error.message)
        res.send(response)
    }



}

/**
 * Retrieve the stock
 * @param {*} req 
 * @param {*} res 
 */
let getStock = async function (req, res) {
    try {
        console.log("Listing all items in inventory")
        let doc = await operation.getDocInDB()
        let items = _.get(doc, "items", [])
        if (_.isEmpty(items)) {
            throw new Error("Stock is empty please add items")
        }
        res.send({
            "status": "success",
            "statusCode": 200,
            "items": items
        })
    } catch (error) {
        console.error("Error while fetching stock :: " + error.message)
        res.send({
            "status": "failure",
            "statusCode": 500,
            "message": error.message,
            "items": []
        })
    }
}

module.exports = {
    fillUpStock,
    getStock
}