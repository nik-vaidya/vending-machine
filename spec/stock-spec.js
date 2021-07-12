const inventoryOp = require('../inventory/operation')
const stock = require('../inventory/stock')
const response = {
    "send": function (data) {
        this.data = data;
        return this;
    }
}

let doc = {
    id: "inventory",
    items: [
        {
            "name": "maza",
            "quantity": 20,
            "unitCost": 15
        },
        {
            "name": "coke",
            "quantity": 50,
            "unitCost": 8
        }
    ]
}


describe("TEST :: fillUpStock ::", () => {

    it("success :: stock refilled successfully", async (done) => {
        let req = {
            body: [
                {
                    "name": "coke",
                    "quantity": 50,
                    "unitCost": 8
                },
                {
                    "name": "thumpsup",
                    "quantity": 30,
                    "unitCost": 10
                }
            ]
        }

        let updatedStock = {
            id: "inventory",
            items: [
                {
                    "name": "maza",
                    "quantity": 20,
                    "unitCost": 15
                },
                {
                    "name": "coke",
                    "quantity": 100,
                    "unitCost": 8
                },
                {
                    "name": "thumpsup",
                    "quantity": 30,
                    "unitCost": 10
                }
            ]
        }
        spyOn(inventoryOp, "getDocInDB").and.returnValue(doc)
        spyOn(inventoryOp, "upsertDataInDb").and.returnValue(updatedStock)
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'success', statusCode: 200, result: updatedStock })
        })
        await stock.fillUpStock(req, response)
        done()
    })

    it("failure :: unable to fill up stock", async (done) => {
        let req = {
            body: [
                {
                    "name": "coke",
                    "quantity": 50,
                    "unitCost": 8
                }
            ]
        }
        spyOn(inventoryOp, "getDocInDB").and.throwError("Unable to get document")
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'Unable to get document' })
        })
        await stock.fillUpStock(req, response)
        done()
    })

    it("success :: stock filled successfully", async (done) => {
        let req = {
            body: {
                "name": "thumpsup",
                "quantity": 30,
                "unitCost": 10
            }
        }

        let updatedStock = {
            id: "inventory",
            items: [
                {
                    "name": "thumpsup",
                    "quantity": 30,
                    "unitCost": 10
                }
            ]
        }
        spyOn(inventoryOp, "getDocInDB").and.returnValue({})
        spyOn(inventoryOp, "upsertDataInDb").and.returnValue(updatedStock)
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'success', statusCode: 200, result: updatedStock })
        })
        await stock.fillUpStock(req, response)
        done()
    })

})


describe("TEST :: getSock ::", () => {

    it("success :: stock retrieved successfully", async (done) => {
        let req = {}

        let availableStock = {
            id: "inventory",
            items: [
                {
                    "name": "maza",
                    "quantity": 20,
                    "unitCost": 15
                }
            ]
        }
        spyOn(inventoryOp, "getDocInDB").and.returnValue(availableStock)
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'success', statusCode: 200, items: [{ name: 'maza', quantity: 20, unitCost: 15 }] })
        })
        await stock.getStock(req, response)
        done()
    })

    it("failure :: unable to get stock", async (done) => {
        let req = {}
        spyOn(inventoryOp, "getDocInDB").and.throwError("Unable to get document")
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'Unable to get document', "items":[] })
        })
        await stock.getStock(req, response)
        done()
    })

    it("failure :: stock is empty", async (done) => {
        let req = {}
        spyOn(inventoryOp, "getDocInDB").and.returnValue({})
        spyOn(response, "send").and.callFake(function (result) {
            expect(result).toEqual({ status: 'failure', statusCode: 500, message: 'Stock is empty please add items', items: [] })
        })
        await stock.getStock(req, response)
        done()
    })

})