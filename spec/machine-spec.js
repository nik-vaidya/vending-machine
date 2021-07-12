const machine = require('../machines/machine')
const constants = require("../constants/constant")
const inventoryOps = require('../inventory/operation')


const response = {
    "send": function (data) {
        this.data = data;
        return this;
    }
}

describe("Test :: Collect Cash", () => {

    afterEach(() => {
        State = constants.READY_STATE
    })

    it("Collect Cash :: success :: Cash is collected successfully", async (done) => {
        let req = {
            body: {
                "amount": 20,
                "currency": "INR"
            }
        }
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'success', statusCode: 200, state: 'CASH_COLLECTED', amount: 20, currency: 'INR' })
        })
        await machine.collectCash(req, response)
        done()
    })

    it("Collect Cash :: failure :: Unable to collect cash", async (done) => {
        let req = {
            body: {
                "amount": 20,
                "currency": "INR"
            }
        }
        State = constants.CASH_COLLECTED_STATE
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'Machine is not in Ready state' })
        })
        await machine.collectCash(req, response)
        done()
    })
})


describe("Test :: Cancle transaction", () => {

    afterEach(() => {
        State = constants.READY_STATE
    })

    it("Cancel :: success :: Transaction canceled successfully", async (done) => {
        let req = {
            body: {}
        }
        State = constants.CASH_COLLECTED_STATE
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'success', statusCode: 200, state: 'READY', amount: 20, currency: 'INR' })
        })
        await machine.cancel(req, response)
        done()
    })

    it("Cancel :: failure :: Unable to cancle", async (done) => {
        let req = {
            body: {}
        }
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'Transaction is cancelled successfully. Please insert cash to buy an item' })
        })
        await machine.cancel(req, response)
        done()
    })
})


describe("Test :: Dispense item", () => {

    it("Dispense item :: success :: item dispensed successfully", async (done) => {
        let req = {
            body: {
                "name": "coke"
            }
        }
        CashCollected = {
            amount: 20,
            currency: "INR"
        }
        State = constants.CASH_COLLECTED_STATE
        spyOn(inventoryOps, "getItem").and.returnValue({
            "name": "coke",
            "quantity": 50,
            "unitCost": 8
        })
        spyOn(inventoryOps, "modifyItemQuantity").and.returnValue({
            "name": "coke",
            "quantity": 49,
            "unitCost": 8
        })
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'success', statusCode: 200, state: 'READY', item: 'coke', change: 12 })
        })
        await machine.dispenseItem(req, response)
        done()
    })

    it("Dispense item :: failure :: please insert cash", async (done) => {
        let req = {
            body: {
                "name": "coke"
            }
        }
        State = constants.READY_STATE
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'Please insert cash to buy an item', item: '', change: 0 })
        })
        await machine.dispenseItem(req, response)
        done()
    })

    it("Dispense item :: failure :: insufficient funds", async (done) => {
        let req = {
            body: {
                "name": "coke"
            }
        }
        CashCollected = {
            amount: 5,
            currency: "INR"
        }
        State = constants.CASH_COLLECTED_STATE
        spyOn(inventoryOps, "getItem").and.returnValue({
            "name": "coke",
            "quantity": 50,
            "unitCost": 8
        })
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'Insufficient cash', item: '', change: 5 })
        })
        await machine.dispenseItem(req, response)
        done()
    })

    it("Dispense item :: failure :: out of stock", async (done) => {
        let req = {
            body: {
                "name": "coke"
            }
        }
        CashCollected = {
            amount: 5,
            currency: "INR"
        }
        State = constants.CASH_COLLECTED_STATE
        spyOn(inventoryOps, "getItem").and.returnValue({
            "name": "coke",
            "quantity": 0,
            "unitCost": 8
        })
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'coke is out of stock', item: '', change: 5 })
        })
        await machine.dispenseItem(req, response)
        done()
    })
})