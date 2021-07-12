const connection = require('../inventory/connection')
const mongoose = require('mongoose')


describe("Tets :: connection ::", ()=>{

    it("setupConnection ::", async (done)=>{
        spyOn(mongoose, "connect").and.returnValue("connection")
        await connection.setupConnection("mongodb://test:27017/?authSource=admin")
        done()

    })

    it("Failure :: setupConnection ::", (done)=>{
        spyOn(mongoose, "connect").and.throwError("Unable to connect")
        connection.setupConnection("mongodb://test:27017/?authSource=admin").catch((err)=>{
            expect(err.message).toEqual("Unable to connect")
        })
        done()

    })
})

