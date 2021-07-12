const _ = require('lodash')
const constants = require('../constants/constant')
const inventoryOperation = require('../inventory/operation')
const utils = require('../utils/util')

const defaultAmount = {
    amount: 0,
    currency: "INR"
}

const supportedCurrecy = ["EUR", "INR", "USD"]

global.TotalCash = 0
global.State = constants.READY_STATE
global.CashCollected = defaultAmount


/**
 * Collects the cash entered by user along with currency and
 * change machine state to CASH_COLLECTED.
 * It will not accept cash untill machine is in READY state
 *
 * @param {*} req
 * @param {*} res
 */
const collectCash = async function (req, res) {
    try {
        console.log("Collecting the amount")
        let body = req.body
        if (State != constants.READY_STATE) {
            throw new Error("Cash is collected, please select an item")
        }
        let currency = _.get(body, "currency", "")
        if (!supportedCurrecy.includes(currency)) {
            throw new Error("This currency yet not supported. We will be adding support soon!!")
        }
        CashCollected = body
        State = constants.CASH_COLLECTED_STATE
        console.log("Cash is collected, please select an item")
        res.send({
            "status": "success",
            "statusCode": 200,
            "state": constants.CASH_COLLECTED_STATE,
            "amount": body.amount,
            "currency": body.currency
        })
    } catch (error) {
        console.error("Error while collecting cash" + error.message)
        res.send({
            "status": "failure",
            "statusCode": 500,
            "message": error.message
        })
    }

}

/**
 * Cancle the transaction after collecting cash.
 * Transaction can not be cancelled if machine is not in
 * CASH_COLLECTED state
 * @param {*} req
 * @param {*} res
 */
const cancel = async function (req, res) {
    try {
        console.log("Cancelling the transaction")
        if (State != constants.CASH_COLLECTED_STATE) {
            throw new Error("Transaction is cancelled successfully. Please insert cash to buy an item")
        }
        let amt = CashCollected.amount
        let currency = CashCollected.currency
        CashCollected = defaultAmount
        State = constants.READY_STATE
        console.log("Transaction cancelled successfully")
        res.send({
            "status": "success",
            "statusCode": 200,
            "state": constants.READY_STATE,
            "amount": amt,
            "currency": currency
        })
    } catch (error) {
        console.error("Error while canceling transaction :: " + error.message)
        res.send({
            "status": "failure",
            "statusCode": 500,
            "message": error.message
        })
    }
}


/**
 * Dispense the required item after collecting the cash
 * return the item to user and change if needed
 * @param {*} req
 * @param {*} res
 */
const dispenseItem = async function (req, res) {
    try {
        console.log("Despensing an Item")
        var amt = 0;
        //check for cash collected
        if (State != constants.CASH_COLLECTED_STATE) {
            throw new Error("Please insert cash to buy an item")
        }
        let itemName = req.body["name"]
        amt = CashCollected.amount
        var currency = CashCollected.currency
        let item = await inventoryOperation.getItem(itemName)
        // check if selected item was never in stock
        if (_.isEmpty(item)) {
            throw new Error("Invalid item. Please select the item on list")
        }
        // check for out of stock
        if (item["quantity"] == 0) {
            throw new Error(item["name"] + " is out of stock")
        }
        let purchasingAmt = utils.convertCurrency(amt, "INR", currency)
        // check for insufficent fund
        if (purchasingAmt < item['unitCost']) {
            throw new Error("Insufficient cash")
        }
        State = constants.DISPENSE_ITEM_STATE
        await inventoryOperation.modifyItemQuantity(itemName)
        State = constants.DISPENSE_CHANGE_STATE
        let change = purchasingAmt - item['unitCost']
        change = utils.convertCurrency(change, currency, "INR")
        State = constants.READY_STATE
        CashCollected = defaultAmount
        TotalCash += item['unitCost']
        console.log("Item dispensed successfully")
        res.send({
            "status": "success",
            "statusCode": 200,
            "state": constants.READY_STATE,
            "item": itemName,
            "change": change
        })
    } catch (error) {
        console.error("Error while dispensing item :: " + error.message)
        State = constants.READY_STATE
        CashCollected = defaultAmount
        res.send({
            "status": "failure",
            "statusCode": 500,
            "message": error.message,
            "item": "",
            "change": amt
        })
    }
}


module.exports = {
    collectCash,
    cancel,
    dispenseItem
}