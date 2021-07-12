const inventoryOp = require('../inventory/operation')
const inventorySch = require('../inventory/schema')


describe("TEST :: getDocInDB", () => {

    it("success :: Doc is retried from db", async (done) => {
        let doc = {
            id: "inventory",
            items: [
                {
                    "name": "coke",
                    "quantity": 50,
                    "unitCost": 8
                }
            ]
        }
        let returnValue = {
            findOne: function (query) {
                return {
                    lean: function () {
                        return doc
                    }
                }
            }
        }
        spyOn(inventorySch, "createModel").and.returnValue(returnValue)
        let result = await inventoryOp.getDocInDB()
        expect(result).toEqual(doc)
        done()
    })

    it("failure :: unable to retrieve doc", async (done) => {
        spyOn(inventorySch, "createModel").and.throwError("Unable to create model")
        try {
            let result = await inventoryOp.getDocInDB()
        } catch (error) {
            expect(error.message).toEqual("Unable to create model")
        }
        done()
    })
})


describe("TEST :: getItemInDB", () => {

    it("success :: item retrieved successfully", async (done) => {
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
        let returnValue = {
            findOne: function (query) {
                return {
                    lean: function () {
                        return doc
                    }
                }
            }
        }
        spyOn(inventorySch, "createModel").and.returnValue(returnValue)
        let result = await inventoryOp.getItem("coke")
        expect(result).toEqual({ name: 'coke', quantity: 50, unitCost: 8 })
        done()
    })

    it("failure :: unable to retrieve item", async (done) => {
        spyOn(inventorySch, "createModel").and.throwError("Unable to create model")
        try {
            let result = await inventoryOp.getItem("coke")
        } catch (error) {
            expect(error.message).toEqual("Unable to create model")
        }
        done()
    })
})

describe("TEST :: upsertDataInDb", () => {

    it("success", async (done) => {
        let doc = {
            id: "inventory",
            items: [
                {
                    "name": "coke",
                    "quantity": 50,
                    "unitCost": 8
                }
            ]
        }
        let returnValue = {
            findOneAndUpdate: function (id, data, options, callback) {
                return callback(false, doc)
            }
        }
        spyOn(inventorySch, "createModel").and.returnValue(returnValue)
        let result = await inventoryOp.upsertDataInDb()
        expect(result).toEqual({ id: 'inventory', items: [{ name: 'coke', quantity: 50, unitCost: 8 }] })
        done()
    })

    it("failure", async (done) => {
        let returnValue = {
            findOneAndUpdate: function (id, data, options, callback) {
                return callback("Unable to upsert", {})
            }
        }
        spyOn(inventorySch, "createModel").and.returnValue(returnValue)
        try {
            await inventoryOp.upsertDataInDb()
        } catch (error) {
            expect(error.message).toEqual("Unable to upsert")
        }
        done()
    })

})


describe("TEST :: modifyItemQuantity ::", () => {

    it("success :: item modified successfully", async (done) => {
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
        let findValue = {
            findOne: function (query) {
                return {
                    lean: function () {
                        return doc
                    }
                }
            }
        }
        let upsertValue = {
            findOneAndUpdate: function (id, data, options, callback) {
                return callback(false, data)
            }
        }

        spyOn(inventorySch, "createModel").and.returnValues(findValue, upsertValue)
        let result = await inventoryOp.modifyItemQuantity("coke")
        expect(result).toEqual({ id: 'inventory', items: [{ name: 'maza', quantity: 20, unitCost: 15 }, { name: 'coke', quantity: 49, unitCost: 8 }] })
        done()
    })

    it("failure :: unable to modify", async (done) => {
        spyOn(inventorySch, "createModel").and.throwError("Unable to fetch doc")
        try {
            await inventoryOp.modifyItemQuantity("coke")
        } catch (error) {
            expect(error.message).toEqual("Unable to fetch doc")
        }
        done()
    })

})