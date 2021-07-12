const schema = require('../inventory/schema')
const mongoose = require('mongoose')


describe("Tets :: Schema ::", ()=>{

    it("Create Model ::", async (done)=>{
        spyOn(mongoose, "model").and.returnValue("model")
        let result = await schema.createModel()
        expect(result).toEqual("model")
        done()

    })
})

