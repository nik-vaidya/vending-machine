const utils = require('../utils/util')




describe("TEST :: Convert currencry", () => {


    it("Convert INR to USD", () => {
        let value = utils.convertCurrency(10, "USD", "INR")
        expect(value).toEqual(0.13)
    })

    it("Convert USD to INR", () => {
        let value = utils.convertCurrency(10, "INR", "USD")
        expect(value).toEqual(744.9)
    })

    it("Convert EUR to INR", () => {
        let value = utils.convertCurrency(10, "INR", "EUR")
        expect(value).toEqual(884.7)
    })

    it("Convert INR to EUR", () => {
        let value = utils.convertCurrency(100, "EUR", "INR")
        expect(value).toEqual(1.13)
    })
})